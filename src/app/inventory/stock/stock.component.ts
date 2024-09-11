import { Component, input } from '@angular/core';
import { IIngredient } from '../../models/ingredient.model';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'stock',
  standalone: true,
  imports: [MatTableModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})
export class StockComponent {

  ingredientListInput = input.required<IIngredient[]>();
  displayedColumns: string[] = ['id', 'name', 'stock'];

  constructor() { }

  
}
