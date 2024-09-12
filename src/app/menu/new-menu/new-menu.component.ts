import { Component, computed, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgIf, NgForOf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { IIngredient, IMenuIngredientList } from '../../models/ingredient.model';
import { InventoryApiService } from '../../services/inventory-api.service';
import { Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddIngredientDialogComponent } from './add-ingredient-dialog/add-ingredient-dialog.component';
import { CurrencyPipe } from '@angular/common';
import { IMenu } from '../../models/menu.model';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { MenuApiService } from '../../services/menu-api.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'new-menu',
  standalone: true,
  imports: [
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatTableModule,
    NgClass,
    MatDialogModule,
    ReactiveFormsModule,
    NgIf,
    CurrencyPipe,
    NgForOf,
    ToastModule
  ],
  templateUrl: './new-menu.component.html',
  styleUrl: './new-menu.component.css',
  providers: [MessageService]
})

export class NewMenuComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['ID', 'Name', ' '];
  displayedColumnsAdded: string[] = ['ID', 'Name', 'Quantity', ' '];
  hasAddedIngredient = signal<boolean>(false);
  newIngredientsCount = signal<number>(0);
  imagePreview = signal<string>('preview_icon.svg');
  removeIconSrc = signal<string>('close_icon.svg');
  ingredientList = signal<IIngredient[]>([]);
  OriginalIngredientList = signal<IIngredient[]>([]);
  ingredientListMenu = signal<IIngredient[]>([]);
  menuAdded = output<IMenu>();
  imageUploaded = computed(() => this.imagePreview() !== 'preview_icon.svg' && this.imagePreview() !== '');
  hasIngredients = computed(() => this.ingredientListMenu().length !== 0);
  newMenuForm: FormGroup;
  ingredientSuscription?: Subscription;
  confirmationSuscription?: Subscription;
  dialogSuscription?: Subscription;
  private _dialog = inject(MatDialog);
  private _ingredientApiService = inject(InventoryApiService);
  private _menuApiService = inject(MenuApiService);

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.newMenuForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      price: ['', [Validators.required, Validators.min(60)]],
      description: ['', [Validators.required, Validators.maxLength(300), Validators.pattern("^[a-zA-Z \s.,;:!?()'-]+$")]],
      photo: ['', [Validators.required]],
      isAvailable: ['', [Validators.required]],
      quantities: this.fb.array([])
    });

  }

  ngOnInit(): void {
    this.ingredientSuscription = this._ingredientApiService.getInventory().subscribe({
      next: (data: IIngredient[]) => {
        if(data) {
          this.ingredientList.set(data);
          this.OriginalIngredientList.set(data);
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    })
  }

  ngOnDestroy(): void {
    this.ingredientSuscription?.unsubscribe();
    this.dialogSuscription?.unsubscribe();
    this.confirmationSuscription?.unsubscribe();
  }

  onFileSelected(event: any) {
    const file: File | null = event.target.files[0] as File | null;

    if(file) {
      const reader = new FileReader();

      reader.onloadend = (e) => {
        this.imagePreview.set(e.target?.result as string);
        this.newMenuForm.get('photo')?.setValue(e.target?.result as string);
      }

      reader.readAsDataURL(file);
    }
  }

  onIngredientAdded(element: IIngredient): void {
    this.ingredientListMenu.update(prev => [...prev, element]);
    this.ingredientList.update((ingredients: IIngredient[]) => ingredients.filter((ingredient: IIngredient) => ingredient.idIngredient !== element.idIngredient));

    this.quantitiesArray.push(this.fb.control('', [Validators.required, Validators.min(1)]));
  }

  onIngredientRemove(element: IIngredient, index: number) {
    if(element.idIngredient) {
      this.ingredientListMenu.update((ingredients: IIngredient[]) => ingredients.filter((ingredient: IIngredient) => ingredient.idIngredient !== element.idIngredient));
      const newArray: IIngredient[] = [];
      let hasBeenAdded: boolean = false;
      let foundABiggerNumber: boolean = false;
  
      for(let i = 0; i < this.ingredientList().length; i++) {
        const id: number | null = this.ingredientList()[i].idIngredient || null;
        if(id) {
          if(element.idIngredient > id && !hasBeenAdded) {
            newArray.push(this.ingredientList()[i]);
          } else if(element.idIngredient < id && !hasBeenAdded) {
            newArray.splice(i, 0, element);
            newArray.push(this.ingredientList()[i]);
            hasBeenAdded = true;
            foundABiggerNumber = true;
          } else {
            newArray.push(this.ingredientList()[i]);
          }
        }
        
      }

      if(!foundABiggerNumber) {
        newArray.push(element);
      }

      this.ingredientList.set(newArray);
    } else {
      this.newIngredientsCount() !== 0 && this.newIngredientsCount.update(prev => prev - 1);
      this.newIngredientsCount() === 0 && this.hasAddedIngredient.set(false);

      this.ingredientListMenu.update((ingredients: IIngredient[]) => {
        const array: IIngredient[] = [];

        ingredients.filter((ingredient: IIngredient) => {
          if(ingredient.name !== element.name) {
            array.push(ingredient);
          } else {
            if(ingredient.stock !== 0 && ingredient.idIngredient !== undefined) {
              array.push(ingredient);
            }
          }
        });
        return array;
      });

    }
    this.quantitiesArray.removeAt(index);
  }

  addNewIngredient() {
    this.dialogSuscription = this._dialog.open(AddIngredientDialogComponent, {
      disableClose: true
    }).afterClosed().subscribe((data: IIngredient) => {
      if(data) {
        this.hasAddedIngredient.set(true);
        this.ingredientListMenu.update((prev) => [...prev, data]);
        this.newIngredientsCount.update(prev => prev + 1);
        this.quantitiesArray.push(this.fb.control('', [Validators.required]));
      }
    });


  }

  onMouseOverHandler = (e: MouseEvent, typeButton: string) => {
    if(typeButton === 'remove') {
      const button = e.currentTarget as HTMLButtonElement;
      const imgWithing = button.querySelector('img');
      imgWithing && (imgWithing.src = 'close_icon_mouseover.svg');
    } else {
      const button = e.currentTarget as HTMLButtonElement;
      const imgWithing = button.querySelector('img');
      imgWithing && (imgWithing.src = 'add_icon_mouseover.svg');
    }

  };

  onMouseOutHandler = (e: MouseEvent, typeButton: string) => {
    if(typeButton === 'remove') {
      const button = e.currentTarget as HTMLButtonElement;
      const imgWithing = button.querySelector('img');
      imgWithing && (imgWithing.src = 'close_icon.svg');
    } else {
      const button = e.currentTarget as HTMLButtonElement;
      const imgWithing = button.querySelector('img');
      imgWithing && (imgWithing.src = 'add_icon.svg');
    }
  }

  onlyChars(typeOfInput: string): void {
    const checker: string = this.newMenuForm.get(typeOfInput)?.value.toString();
    if(!checker.match("^[a-zA-Z \s.,;:!?()'-]+$")) {
      this.newMenuForm.get(typeOfInput)?.patchValue('');
    }
  }

  onlyNumbers(input: string, index?: number) {    
    if(input === 'quantity' && index !== undefined) {
      if(!this.quantitiesArray.at(index)?.value) {
        this.quantitiesArray.at(index).patchValue('');
      }
    } else {
      const checker: number = this.newMenuForm.get(input)?.value;
      if(!checker) {
        this.newMenuForm.get(input)?.patchValue('');
      }
    }
  }

  get quantitiesArray() {
    return this.newMenuForm.get('quantities') as FormArray;
  }

  onSubmit(): void {

    const menuIngredientListBody: IMenuIngredientList[] = [];

    this.ingredientListMenu().forEach((item: IIngredient, index: number) => {
      const { idIngredient, name } = item;

      if(idIngredient) {
        const ilmBody: IMenuIngredientList = { idIngredient: idIngredient, ingredientName: name, quantity: Number(this.quantitiesArray.at(index).value) }
        menuIngredientListBody.push(ilmBody);
      } else {
        const ilmBody: IMenuIngredientList = { ingredientName: name, quantity: Number(this.quantitiesArray.at(index).value) }
        menuIngredientListBody.push(ilmBody);
      }
    });
    

    const body: IMenu = {
      name: this.newMenuForm.get('name')?.value,
      description: this.newMenuForm.get('description')?.value,
      price: this.newMenuForm.get('price')?.value,
      photo: this.imagePreview(),
      isAvailable: false,
      menuIngredientListList: menuIngredientListBody
    }

    
    const dialogTransaction = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        menuInfo: body,
        showLoad: false
      },
      disableClose: true
    });
    
    
    this.confirmationSuscription = dialogTransaction.afterClosed().subscribe((answer: boolean) => {
      if(answer) {
        this._menuApiService.newMenu(body).subscribe({
          next: (data: IMenu) => {
            this._dialog.open(ConfirmationDialogComponent, {
              data: {
                menuInfo: null,
                showLoad: true
              },
              disableClose: true
            });
            
            this.sendMenu(data);
            this.newMenuForm.reset();
            this.imagePreview.set('preview_icon.svg');
            this.ingredientListMenu.set([]);
            this.quantitiesArray.clear();

            if(this.hasAddedIngredient()) {
              this.hasAddedIngredient.set(false);
              this.newIngredientsCount.set(0);
              this._ingredientApiService.getInventory().subscribe({
                next: (data: IIngredient[]) => {
                  this.ingredientList.set(data);
                  this.OriginalIngredientList.set(data);
                }
              })
            } else {
              this.ingredientList.set(this.OriginalIngredientList());
            }

            setTimeout(() => {
              this._dialog.closeAll();
            }, 3000);

            setTimeout(() => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Menu has been added' });
            }, 3000);
          },
          error: (error: any) => {

            this._dialog.closeAll();

            if(error.error.message === 'request parameters no met') {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'request parameters no met.' });
            } else if(error.error.message === 'Menu has been already added') {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Menu has been already added.' });
            } else {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'There has been an error, try later.' });
            }
          }
        })
      }


    });

  }

  sendMenu(menu: IMenu): void {
    this.menuAdded.emit(menu);
  }

  preventWheel(formType: string, index?: number) {
    if(formType === 'quantity' && index !== undefined) {
      this.quantitiesArray.at(index).patchValue('');
    } else {
      formType === 'price' && this.newMenuForm.get('price')?.setValue('');
    }

  }
}