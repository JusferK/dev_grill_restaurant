import { Component, inject, OnDestroy, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmationComponent } from './dialog-confirmation/dialog-confirmation.component';
import { IIngredient } from '../../models/ingredient.model';
import { InventoryApiService } from '../../services/inventory-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'new-ingredient',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './new-ingredient.component.html',
  styleUrl: './new-ingredient.component.css'
})
export class NewIngredientComponent implements OnDestroy {

  notificationSignalSend = signal<boolean>(false);
  errorReturned = signal<boolean>(false);
  valuesAreEmpty = signal<boolean[]>([false, false]);
  typeOfError = signal<string>('');
  newIngredientForm: FormGroup;
  ingredientAdded = output<IIngredient>();
  suscription?: Subscription;
  dialog_suscription?: Subscription;
  private _dialog = inject(MatDialog);
  private _inventoryApiService = inject(InventoryApiService);

  constructor(private _formBuilder: FormBuilder) {
    this.newIngredientForm = this._formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      stock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnDestroy(): void {
    this.dialog_suscription?.unsubscribe();
    this.suscription?.unsubscribe();
  }

  onSubmit(): void {
    if(this.newIngredientForm.valid) {
      this.dialog_suscription = this._dialog.open(DialogConfirmationComponent, {
        data: {
          ingredient_name: this.newIngredientForm.get('name')?.value,
          stock: this.newIngredientForm.get('stock')?.value,
        }
      })
      .afterClosed().subscribe(result => {
        if(result.answer) {

          const body: IIngredient = {
            name: this.newIngredientForm.get('name')?.value,
            stock: this.newIngredientForm.get('stock')?.value
          }

          this.suscription = this._inventoryApiService.addIngredient(body).subscribe({
            next: (data: IIngredient) => {
              this.newIngredientForm.reset();
                this.sendIngredient(data);
                this.notificationSignalSend.set(true);
                setTimeout(() => {
                  this.notificationSignalSend.set(false);
                }, 1000);
            },
            error: (error: any) => {
              this.newIngredientForm.reset();
                this.errorReturned.set(true);
                error.error.message === 'Ingredient is already on records' ? this.typeOfError.set(error.error.message) : this.typeOfError.set('An error has ocurred, try later');
                this.notificationSignalSend.set(true);
                setTimeout(() => {
                  this.notificationSignalSend.set(false);
                  this.typeOfError.set
                  this.typeOfError.set('');
                  this.errorReturned.set(false);
                }, 1000);
            }
          })
        }
      });
      
    }
  }

  sendIngredient(ingredient: IIngredient): void {
    this.ingredientAdded.emit(ingredient);
  }

  hasError(input: string, typeOfError: string) {
    return this.newIngredientForm.get(input)?.hasError(typeOfError) && this.newIngredientForm.get(input)?.touched;
  }

  onlyNumbers(): void {
    if(this.newIngredientForm.get('stock')?.value === null) {
      this.newIngredientForm.get('stock')?.setValue('');
    }

    const temporalArray = this.valuesAreEmpty();

    if(this.newIngredientForm.get('stock')?.valid) {
      temporalArray[1] = true;
      this.valuesAreEmpty.set(temporalArray);
    } else if(!this.newIngredientForm.get('stock')?.valid) {
      temporalArray[1] = false;
      this.valuesAreEmpty.set(temporalArray);
    }
  }

  valuesCheck(): void {
    
    const temporalArray = this.valuesAreEmpty();

    if(this.newIngredientForm.get('name')?.valid) {
      temporalArray[0] = true;
      this.valuesAreEmpty.set(temporalArray);
    } else if(!this.newIngredientForm.get('name')?.valid) {
      temporalArray[0] = false;
      this.valuesAreEmpty.set(temporalArray);
    }
  }

}