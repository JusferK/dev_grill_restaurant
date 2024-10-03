import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgStyle } from '@angular/common';
import { MatFormField, MatLabel, MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryApiService } from '../../../services/inventory-api.service';
import { IIngredient } from '../../../models/ingredient.model';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-update-dialog-form',
  standalone: true,
  imports: [
    MatDialogContent,
    MatButtonModule,
    MatDialogActions,
    NgIf,
    NgStyle,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './update-dialog-form.component.html',
  styleUrl: './update-dialog-form.component.css'
})

export class UpdateDialogFormComponent implements OnInit, OnDestroy {

  isAboutShow = signal<boolean>(true);
  showForm = signal<boolean>(false);
  editNameSignal = signal<boolean>(false);
  showConfirmation = signal<boolean>(false);
  confirmSubmitForm = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  ifRecieved = signal<boolean>(false);
  returnError = signal<boolean>(false);
  typeOfError = signal<string>('');
  updateIngredientForm: FormGroup;
  apiSuscription?: Subscription;
  public dialog_data_received = inject(MAT_DIALOG_DATA);
  private _ingredientApiService = inject(InventoryApiService);

  constructor(_formBuilder: FormBuilder, public _dialog: MatDialogRef<UpdateDialogFormComponent>) {
    this.updateIngredientForm = _formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      stock: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.updateIngredientForm.get('name')?.setValue(this.dialog_data_received.ingredient_received.name);
    this.updateIngredientForm.get('name')?.disable();
  }

  ngOnDestroy(): void {
    this.apiSuscription?.unsubscribe();
  }

  confirmHandler(): void {
    this.showForm.set(true);
    this.isAboutShow.set(false);
  }

  cancelHandler(): void {
    this._dialog.close(false);
  }

  numbersOnly(): void {
    if(this.updateIngredientForm.get('stock')?.value === null) {
      this.updateIngredientForm.get('stock')?.setValue('');
    }
  }

  updateConfirmation(): void {
    this.showForm.set(false);
    this.showConfirmation.set(true);
  }

  toggleEditName(): void {
    if(!this.editNameSignal()) {
      this.updateIngredientForm.get('name')?.enable();
      this.editNameSignal.set(true);
    } else {
      this.updateIngredientForm.get('name')?.disable();
      this.editNameSignal.set(false);
    }
  }

  submitUpdate(): void {
    this.showConfirmation.set(false);
    this.isLoading.set(true);

    const body: IIngredient = {
      idIngredient:this.updateIngredientForm.get('idIngredient')?.value,
      name: this.updateIngredientForm.get('name')?.value,
      stock: this.updateIngredientForm.get('stock')?.value 
    }

    setTimeout(() => {
      this.apiSuscription = this._ingredientApiService.updateIngredient(this.dialog_data_received.ingredient_received.idIngredient, body).subscribe({
        next: (data: IIngredient | any) => {
          if(data) {
            if('error' in data) {
              this.isLoading.set(false);
              this.typeOfError.set(data.message);
              this.returnError.set(true);
              this.ifRecieved.set(true);
              setTimeout(() => {
                this._dialog.close();
              }, 1000);
            } else {
              this.isLoading.set(false);
              this.ifRecieved.set(true);
              setTimeout(() => {
                this._dialog.close(data);
              }, 1000);
            }
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.typeOfError.set('An error has ocurred, try later');
          this.returnError.set(true);
          this.ifRecieved.set(true);
          setTimeout(() => {
            this._dialog.close();
          }, 1000);
        }
      });
    }, 2000);
  }

}
