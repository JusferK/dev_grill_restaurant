import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPhone } from '../models/phone.model';

@Injectable({
  providedIn: 'root'
})
export class PhoneApiService {

  baseURL: string;
  private _httpClient = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/phone`;
  }

  removePhone(id: number): Observable<IPhone> {
    return this._httpClient.delete<IPhone>(`${this.baseURL}/remove-phone/${id}`);
  }

  updatePhone(phone: IPhone): Observable<IPhone> {
    return this._httpClient.put<IPhone>(`${this.baseURL}/update-phone`, phone);
  }

  addPhone(phone: IPhone): Observable<IPhone> {
    return this._httpClient.post<IPhone>(`${this.baseURL}/new-phone`, phone);
  }
}
