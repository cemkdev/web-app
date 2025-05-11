import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderEventService {
  private _refreshOrderItems = new Subject<void>();

  // Other components can subscribe to this observable.
  refreshOrderItems$ = this._refreshOrderItems.asObservable();

  // This method triggers the event.
  triggerRefreshOrderItems() {
    this._refreshOrderItems.next();
  }
}
