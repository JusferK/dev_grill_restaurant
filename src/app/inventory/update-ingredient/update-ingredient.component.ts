import { Component, inject, input, OnChanges, output, SimpleChanges } from '@angular/core';
import { IIngredient } from '../../models/ingredient.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { UpdateDialogFormComponent } from './update-dialog-form/update-dialog-form.component';
import { NgFor } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'update-ingredient',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, NgFor],
  templateUrl: './update-ingredient.component.html',
  styleUrl: './update-ingredient.component.css'
})
export class UpdateIngredientComponent implements OnChanges {

  ingredientListInput = input.required<IIngredient[]>();
  ingredientListComponent = new MatTableDataSource<IIngredient>();
  ingredientListUpdated = output<IIngredient[]>();
  displayedColumns: string[] = ['id', 'name', 'stock', ' '];
  ingredientListSuscription?: Subscription;
  dialog_suscription?: Subscription;
  private _dialog = inject(MatDialog);

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['ingredientListInput']) {
      this.ingredientListComponent.data = this.ingredientListInput();
    }
  }

  clickHandler(ingredient: IIngredient, index: number) {
    this.dialog_suscription = this._dialog.open(UpdateDialogFormComponent, {
      data: {ingredient_received: ingredient},
      disableClose: true
    })
    .afterClosed().subscribe(data => {
      if(data) {
        this.ingredientListComponent.data[index] = data;
        this.ingredientListComponent.data = [...this.ingredientListComponent.data];
        this.ingredientListUpdated.emit(this.ingredientListComponent.data);
      }
    });
  }

}
