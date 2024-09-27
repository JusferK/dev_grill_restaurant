import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IIngredient } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryApiService {

  baseURL: string = 'http://192.168.10.23:8080/ingredients';
  //baseURL: string = 'http://localhost:8080/ingredients';
  private _httpClient = inject(HttpClient);
  
  constructor() { }

  getInventory(): Observable<IIngredient[]> {
    return this._httpClient.get<IIngredient[]>(`${this.baseURL}/all-ingredients`);
  }

  getIngredient(id: number): Observable<IIngredient> {
    return this._httpClient.get<IIngredient>(`${this.baseURL}/get-ingredient/${id}`);
  }

  addIngredient(ingredient: IIngredient): Observable<IIngredient> {
    return this._httpClient.post<IIngredient>(`${this.baseURL}/new-ingredient`, ingredient);
  }

  updateIngredient(id: number, ingredient: IIngredient): Observable<IIngredient> {
    return this._httpClient.put<IIngredient>(`${this.baseURL}/update-ingredient/${id}`, ingredient);
  }

}
