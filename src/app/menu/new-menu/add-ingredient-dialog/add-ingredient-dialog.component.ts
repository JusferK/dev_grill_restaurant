import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IIngredient } from '../../../models/ingredient.model';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-ingredient-dialog',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './add-ingredient-dialog.component.html',
  styleUrl: './add-ingredient-dialog.component.css'
})
export class AddIngredientDialogComponent {

  nameForm: FormGroup;
  readonly dialogRed = inject(MatDialogRef<AddIngredientDialogComponent>);

  constructor(private fb: FormBuilder) {
    this.nameForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z \s]+$')]]
    });
  }

  onSubmit(): void {
    const data: IIngredient = {
      name: this.nameForm.get('name')?.value,
      stock: 0
    }

    this.dialogRed.close(data);
  }

  onlyChars(typeOfInput: string): void {
    const checker: string = this.nameForm.get(typeOfInput)?.value.toString();
    if(!checker.match('^[a-zA-Z \s]+$')) {
      this.nameForm.get(typeOfInput)?.patchValue('');
    }
  }

}
