import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAdminType } from '../models/admin-type.models';

@Injectable({
  providedIn: 'root'
})
export class AdministratorTypeApiService {

  baseURL: string;
  private _http = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/administrator-type`;
  }

  getAllAdminTypes(): Observable<IAdminType[]> {
    return this._http.get<IAdminType[]>(`${this.baseURL}/get-administrators-type`);
  }

  newAdminType(body: IAdminType): Observable<IAdminType> {
    return this._http.post<IAdminType>(`${this.baseURL}/new-administrator-type`, body);
  }

}
