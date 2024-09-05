import { Injectable } from '@angular/core';
import { IAdministrator } from '../models/administrator.model';

@Injectable({
  providedIn: 'root'
})

export class ProfileServiceService {

  constructor() {}

  getProfileSaved() {
    return localStorage.getItem('administrator-sesion');
  }

  setProfileSaved(newProfile: IAdministrator): void {
    localStorage.setItem('administrator-sesion', JSON.stringify(newProfile));
  }

  clearProfile() {
    localStorage.removeItem('administrator-sesion');
  }

}
