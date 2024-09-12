import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseURL: string = 'http://192.168.10.18:8080/user';
  private _httpClient = inject(HttpClient);

  constructor() { }

  getAllUsers(): Observable<IUser[]> {
    return this._httpClient.get<IUser[]>(`${this.baseURL}/all-users`);
  }

}