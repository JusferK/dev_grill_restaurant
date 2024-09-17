import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { INews } from '../models/news.model';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {

  baseURL: string = 'http://192.168.10.18:8080/news';
  //baseURL: string = 'http://localhost:8080/news';
  private _httpClient = inject(HttpClient);

  constructor() {}

  getAllNews(): Observable<INews[]> {
    return this._httpClient.get<INews[]>(`${this.baseURL}/all-news`);
  }

  postNew(body: INews): Observable<INews> {
    return this._httpClient.post<INews>(`${this.baseURL}/post-new`, body);
  }

  updateNew(body: INews): Observable<INews> {
    return this._httpClient.put<INews>(`${this.baseURL}/update-new/${body.idNewsItem}`, body);
  }

  deleteNew(newId: number) {
    this._httpClient.delete<INews>(`${this.baseURL}/delete-new/${newId}`)
    .subscribe()
  }

}