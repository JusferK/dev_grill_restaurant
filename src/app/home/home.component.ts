import { Component, inject, OnInit, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common'; 
import { HomeContentComponent } from './home-content/home-content.component';
import { ProfileServiceService } from '../services/profile-service.service';

@Component({
  selector: 'home',
  standalone: true,
  imports: [MatSidenavModule, MatIconModule, MatDividerModule, MatButtonModule, MatBadgeModule, NgIf, RouterLink, RouterOutlet, NgClass, MatMenuModule, HomeContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  sideNavOpen = signal<Boolean>(true);
  mouseOverSignal = signal<Boolean>(false);
  iconName = signal<String[]>(['Home', '', '', '']);
  iconAreActive = signal<boolean[]>([true, false, false, false]);
  indexIcon = signal<number>(-1);
  onSection = signal<number>(0);
  isAtHome = signal<boolean>(true);
  private _profileService = inject(ProfileServiceService);
  private _router = inject(Router);

  ngOnInit(): void {
    const urlDirectories = ['inventory', 'menu', 'news', 'order'];

    urlDirectories.forEach((directory: string, index: number) => {
      if(this._router.url.includes(directory)) {
        this.isAtHome.set(false);

        const temporalArray_iconName = this.iconName();
        const temporalArray_iconAreActive = this.iconAreActive();
          
        temporalArray_iconName[this.onSection()] = '';
        temporalArray_iconName[index + 1] = directory;
        temporalArray_iconAreActive[this.onSection()] = false;
        temporalArray_iconAreActive[index + 1] = true;
          
        this.onSection.set(index + 1);
        this.iconName.set(temporalArray_iconName);
        this.iconAreActive.set(temporalArray_iconAreActive);
      }
    });
  }

  sideNavClicked(): void {
    this.sideNavOpen() ? this.sideNavOpen.set(false) : this.sideNavOpen.set(true);
  }

  mouseOverHandle(element: String): void {    
    const temporalArray = this.iconName();
    switch(element) {
      case 'home_icon':
        if(!this.iconAreActive()[0]) {
          this.indexIcon.set(0);
          temporalArray[this.indexIcon()] = 'Home';
        }
        break;
      case 'inventory_icon':
        if(!this.iconAreActive()[1]) {
          this.indexIcon.set(1);
          temporalArray[this.indexIcon()] = 'Inventory';
        }
        break;
      case 'menu_icon':
        if(!this.iconAreActive()[2]) {  
          this.indexIcon.set(2);
          temporalArray[this.indexIcon()] = 'Menu';
        }
        break;
      case 'news_icon':
        if(!this.iconAreActive()[3]) {
          this.indexIcon.set(3);
          temporalArray[this.indexIcon()] = 'News';
        }
        break;
      case 'food_order':
        if(!this.iconAreActive()[4]) {
          this.indexIcon.set(4);
          temporalArray[this.indexIcon()] = 'Orders';
        }
        break;
    }

    this.iconName.set(temporalArray);
    this.mouseOverSignal.set(true);
  }

  mouseOutHandler(index: number): void {
    if(!this.iconAreActive()[index]) {
      const temporalArray = this.iconName();
      temporalArray[index] = '';
      this.iconName.set(temporalArray);
    }
    
    this.mouseOverSignal.set(false);
  }

  clickHandler(index: number, nameToPlace: string) {

    if(index === 0 && nameToPlace) {
      this.isAtHome.set(true);
    } else {
      this.isAtHome.set(false);
    }

    const temporalArray_iconName = this.iconName();
    const temporalArray_iconAreActive = this.iconAreActive();
    
    temporalArray_iconName[this.onSection()] = '';
    temporalArray_iconName[index] = nameToPlace;
    temporalArray_iconAreActive[this.onSection()] = false;
    temporalArray_iconAreActive[index] = true;

    this.onSection.set(index);
    this.iconName.set(temporalArray_iconName);
    this.iconAreActive.set(temporalArray_iconAreActive);
    
  }

  homeClickHandler(): void {
    this._router.navigate(['']);
  }

  profileClickHandler(): void {
    this._router.navigate(['/profile']);
  }

  logoutHandler(): void {
    this._profileService.clearProfile();
    this._router.navigate(['/login']);
  }
  
}