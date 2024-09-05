import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdministrator } from '../models/administrator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdministratorApiService {

  baseURL: string = 'http://192.168.10.18:8080/administrator';
  //baseURL: string = 'http://localhost:8080/administrator';

  constructor(private _myApiService: HttpClient) { }

  loginAdmin(user: string, password: string): Observable<IAdministrator | boolean> {
    return this._myApiService.get<IAdministrator>(`${this.baseURL}/admin-login/${user}/${password}`);
  }

  updatePassword(id: number, body: IAdministrator): Observable<IAdministrator> {
    return this._myApiService.put<IAdministrator>(`${this.baseURL}/update-admin/${id}`, body);
  }

}
