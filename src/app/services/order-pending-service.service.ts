import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderPendingServiceService {

  ordersPending = signal<number>(0);

  constructor() {}

}
