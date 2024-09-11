import { Component, input } from '@angular/core';
import { IMenu } from '../../models/menu.model';

@Component({
  selector: 'all-menus',
  standalone: true,
  imports: [],
  templateUrl: './all-menus.component.html',
  styleUrl: './all-menus.component.css'
})

export class AllMenusComponent {

  menuListInput = input.required<IMenu[]>();

}
