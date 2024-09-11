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

  isLoading = signal<boolean>(false);
  returnError = signal<boolean>(false);
  menuList = signal<IMenu[]>([]);
  menuSuscription?: Subscription;
  private _menuApiService = inject(MenuApiService);
  
  ngOnInit(): void {
    this.menuSuscription = this._menuApiService.getAllMenus().subscribe({
      next: (data: IMenu[]) => {
        if(data) {
          this.menuList.set(data);
        }
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }

  ngOnDestroy(): void {
    this.menuSuscription?.unsubscribe();
  }
}
