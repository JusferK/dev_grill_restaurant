import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IMenu } from '../models/menu.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MenuApiService {

  baseURL: string = 'http://192.168.10.23:8080/menu';
  //baseURL: string = 'http://localhost:8080/menu';
  private _httpClient = inject(HttpClient);

  constructor() { }

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
