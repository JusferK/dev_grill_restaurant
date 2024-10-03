import { Component, inject, OnChanges, OnInit, signal, Signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { IMenu } from '../../../models/menu.model';
import { UpperCasePipe, CurrencyPipe, NgIf, NgStyle } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { IIngredient, IMenuIngredientList } from '../../../models/ingredient.model';
import { InventoryApiService } from '../../../services/inventory-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

interface customInterface {
  id: number;
  name: string;
  stock: number;
  quantity: number;
}

@Component({
  selector: 'app-menu-detail',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatButtonModule,
    UpperCasePipe,
    CurrencyPipe,
    MatExpansionModule,
    MatDialogClose,
    NgIf,
    MatProgressSpinnerModule,
    MatTableModule,
    NgStyle
  ],
  templateUrl: './menu-detail.component.html',
  styleUrl: './menu-detail.component.css'
})
export class MenuDetailComponent implements OnInit {

  displayedColumns: string[] = ['ID', 'Name', 'Quantity', 'Stock'];
  menuDetailShow?: Signal<IMenu>;
  ingredientInfoList = signal<customInterface[]>([]);
  isLoading = signal<boolean>(true);
  readonly panelOpenState = signal(false);
  private _data = inject(MAT_DIALOG_DATA);
  private _ingredientApiService = inject(InventoryApiService);

  ngOnInit(): void {
    this.menuDetailShow = signal<IMenu>(this._data);

    this.menuDetailShow().menuIngredientListList.forEach((menuIngredient: IMenuIngredientList) => {
      if(menuIngredient.idIngredient) {
        this._ingredientApiService.getIngredient(menuIngredient.idIngredient).subscribe({
          next: (data: IIngredient) => {
            if(data.idIngredient) {
              const customeInfo: customInterface = {
                id: data.idIngredient,
                name: data.name,
                quantity: menuIngredient.quantity,
                stock: data.stock
              }
              this.ingredientInfoList.update((prev) => [...prev, customeInfo]);
              if(this.menuDetailShow) {
                if(this.ingredientInfoList().length === this.menuDetailShow().menuIngredientListList.length) {
                  setTimeout(() => {
                    this.isLoading.set(false);
                  }, 1000);
                }
              }
            }
          }
        }); 
      }
    });
  }


}
