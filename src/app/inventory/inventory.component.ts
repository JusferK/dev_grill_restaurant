import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InventoryApiService } from '../services/inventory-api.service';
import { IIngredient } from '../models/ingredient.model';
import { Subscription } from 'rxjs';
import { StockComponent } from './stock/stock.component';
import { NewIngredientComponent } from './new-ingredient/new-ingredient.component';
import  { UpdateIngredientComponent } from './update-ingredient/update-ingredient.component';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatTabsModule, NgIf, MatProgressSpinnerModule, StockComponent, NewIngredientComponent, UpdateIngredientComponent],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})

export class InventoryComponent implements OnInit, OnDestroy{

  isLoading = signal<boolean>(true);
  ingredientList = signal<IIngredient[]>([]);
  returnedError = signal<boolean>(false);
  suscription?: Subscription;
  private _inventoryApiService = inject(InventoryApiService);

  ngOnInit(): void {
    this.suscription = this._inventoryApiService.getInventory().subscribe({
      next: (data: IIngredient[]) => {
        if(data) {
          this.ingredientList.set(data);
          this.isLoading.set(false);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.returnedError.set(true);
      }
    });
  }

  outputHandler(ingredientAdded: IIngredient): void {
    if(ingredientAdded) {
      this.ingredientList.update(prev => {
        return [...prev, ingredientAdded];
      });
    }
  }

  updateOutputHandler(updatedList: IIngredient[]) {
    console.log(updatedList);
    this.ingredientList.set(updatedList);
  }

  ngOnDestroy(): void {
    this.suscription?.unsubscribe();
  }

}
