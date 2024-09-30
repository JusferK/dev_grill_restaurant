import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  baseURL: string;
  private _httpClient = inject(HttpClient);

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/user`;
  }

  getAllUsers(): Observable<IUser[]> {
    return this._httpClient.get<IUser[]>(`${this.baseURL}/all-users`);
  }

}