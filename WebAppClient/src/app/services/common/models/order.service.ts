import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Order } from '../../../contracts/order/create_order';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService: HttpClientService) { }

  // GET
  async create(order: Create_Order): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "orders"
    }, order);

    await firstValueFrom(observable);
  }
}
