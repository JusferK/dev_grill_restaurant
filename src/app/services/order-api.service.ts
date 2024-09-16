import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrderRequest } from '../models/order-request.model';

@Injectable({
  providedIn: 'root'
})
export class OrderApiService {

  baseURL: string = 'http://192.168.10.18:8080/orders';
  //baseURL: string = 'http://localhost:8080/orders';
  private _httpClient = inject(HttpClient);

  constructor() { }

  getAllOrderRequests(): Observable<IOrderRequest[]> {
    return this._httpClient.get<IOrderRequest[]>(`${this.baseURL}/all-orders-placed`);
  }

  getOrderByParameter(parameter: Number | String): Observable<IOrderRequest> {
    return this._httpClient.get<IOrderRequest>(`${this.baseURL}/find-orders/${parameter}`);
  }

  updateOrder(body: any): Observable<IOrderRequest> {
    return this._httpClient.put<IOrderRequest>(`${this.baseURL}/update-order-status/${body.idOrderRequest}`, body);
  }

}
