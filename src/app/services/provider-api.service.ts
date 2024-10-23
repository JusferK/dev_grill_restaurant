import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProvider } from '../models/provider.model';

interface searchProviderParams {
  nit: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {

  private _httpClient = inject(HttpClient);
  baseURL: string;

  constructor() {
    this.baseURL = `${window.location.protocol}//${window.location.hostname}:8080/provider`;
  }

  getAllProviders(): Observable<IProvider[]> {
    return this._httpClient.get<IProvider[]>(`${this.baseURL}/providers`);
  }

  newProvider(body: IProvider): Observable<IProvider> {
    return this._httpClient.post<IProvider>(`${this.baseURL}/new-provider`, body);
  }

  removeProvider(body: IProvider): Observable<IProvider> {
    console.log('made')
    return this._httpClient.delete<IProvider>(`${this.baseURL}/remove-provider/${body.provider_id}`);
  }

  updateProvider(body: IProvider): Observable<IProvider> {
    return this._httpClient.put<IProvider>(`${this.baseURL}/update-provider`, body);
  }

  getProvider(body: searchProviderParams) {
    return this._httpClient.get<IProvider>(`${this.baseURL}/get-provider/${body.name}/${body.nit}`);
  }

}
