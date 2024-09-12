import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { AllMenusComponent } from './all-menus/all-menus.component';
import { NewMenuComponent } from './new-menu/new-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf } from '@angular/common';
import { MenuApiService } from '../services/menu-api.service';
import { Subscription } from 'rxjs';
import { IMenu } from '../models/menu.model';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [DividerModule, MatTabsModule, AllMenusComponent, NewMenuComponent, MatProgressSpinnerModule, NgIf],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})

export class MenuComponent implements OnInit, OnDestroy {

  isLoading = signal<boolean>(true);
  returnError = signal<boolean>(false);
  menuList = signal<IMenu[]>([]);
  menuSuscription?: Subscription;
  private _menuApiService = inject(MenuApiService);
  
  ngOnInit(): void {
    this.menuSuscription = this._menuApiService.getAllMenus().subscribe({
      next: (data: IMenu[]) => {
        if(data) {
          this.menuList.set(data);

          setTimeout(() => {
            this.isLoading.set(false);
          }, 1000);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.returnError.set(true);
      }
    });
  }

  ngOnDestroy(): void {
    this.menuSuscription?.unsubscribe();
  }

  receiveNewMenu(menu: IMenu) {
    console.log('data received from menu!')
    console.table(menu)
    this.menuList.update((prev) => {
      return [...prev, menu];
    });
  }
}
