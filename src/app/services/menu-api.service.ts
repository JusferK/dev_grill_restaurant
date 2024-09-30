import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMenu } from '../models/menu.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MenuApiService {

  baseURL: string;
  private _httpClient = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/menu`;
  }

  getAllMenus(): Observable<IMenu[]> {
    return this._httpClient.get<IMenu[]>(`${this.baseURL}/all-menus`);
  }

  getMenu(menuID: number): Observable<IMenu> {
    return this._httpClient.get<IMenu>(`${this.baseURL}/get-menu/${menuID}`);
  }

  newMenu(body: IMenu): Observable<IMenu> {
    return this._httpClient.post<IMenu>(`${this.baseURL}/new-menu`, body);
  }

}
