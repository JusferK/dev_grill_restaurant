import { Component, inject, OnInit } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ProfileServiceService } from '../../services/profile-service.service';
import { IAdministrator } from '../../models/administrator.model';
import { Router } from '@angular/router';

@Component({
  selector: 'home-content',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './home-content.component.html',
  styleUrl: './home-content.component.css'
})

export class HomeContentComponent implements OnInit {

  adminUser: string = '';
  adminProfile?: IAdministrator;
  private _profileService = inject(ProfileServiceService);
  
  ngOnInit(): void {
    const pivot = this._profileService.getProfileSaved();
    if(pivot !== null) {
      this.adminProfile = JSON.parse(pivot);
      this.adminUser = this.adminProfile?.user || 'user';
    }
  }

}
