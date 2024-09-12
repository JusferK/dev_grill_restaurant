import { Component, inject, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { IMenu } from '../../models/menu.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CurrencyPipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MenuDetailComponent } from './menu-detail/menu-detail.component';

@Component({
  selector: 'all-menus',
  standalone: true,
  imports: [
    CardModule, 
    ButtonModule, 
    CurrencyPipe,
    NgFor
  ],
  templateUrl: './all-menus.component.html',
  styleUrl: './all-menus.component.css'
})

export class AllMenusComponent implements OnInit {

  menuListInput = input.required<IMenu[]>();
  firstTime = signal<boolean>(true);
  inPair: any[][] = [];
  private _dialog = inject(MatDialog);

  ngOnInit(): void {

    this.firstTime.set(false);

    for(let i = 0; i < this.menuListInput().length; i += 2) {
      this.inPair.push(this.menuListInput().slice(i, i + 2));
    }

  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['menuListInput'] && !this.firstTime()) {
      this.inPair = [];
      for(let i = 0; i < this.menuListInput().length; i += 2) {
        this.inPair.push(this.menuListInput().slice(i, i + 2));
      }
    }
  }

  clickHandler(menu: IMenu): void {
    this._dialog.open(MenuDetailComponent, {
      data: menu
    });
  }

}
