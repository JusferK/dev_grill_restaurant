import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IAdministrator } from '../models/administrator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministratorApiService {

  baseURL: string;
  private _myApiService = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/administrator`;
  }

  loginAdmin(user: string, password: string): Observable<IAdministrator | boolean> {

    const body = {
      user: user,
      password: password
    }

    return this._myApiService.post<IAdministrator>(`${this.baseURL}/admin-login/${user}/${password}`, body);
  }

  updatePassword(id: number, body: IAdministrator): Observable<IAdministrator> {
    return this._myApiService.put<IAdministrator>(`${this.baseURL}/update-admin/${id}`, body);
  }

}
