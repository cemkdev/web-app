import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Order } from '../../../contracts/order/create_order';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { List_Order } from '../../../contracts/order/list_order';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private httpClientService: HttpClientService) { }

  // POST / CREATE
  async create(order: Create_Order): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "orders"
    }, order);

    await firstValueFrom(observable);
  }

  // GET / LIST / READ
  async getAllOrders(page: number = 0, size: number = 10, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalOrderCount: number, orders: List_Order[] }> {
    const data = await firstValueFrom(
      this.httpClientService.get<{ totalOrderCount: number, orders: List_Order[] }>({
        controller: "orders",
        queryString: `page=${page}&size=${size}`
      }).pipe(
        map(response => {
          successCallBack && successCallBack();
          return response;
        }),
        catchError((errorResponse: HttpErrorResponse) => {
          if (errorCallBack) {
            errorCallBack(errorResponse.message);
          }
          return [];
        })
      )
    );
    return data;
  }

  // DELETE
  async delete(id: string) {
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "orders"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  // DELETE RANGE - POST
  async deleteRange(orderIds: string[]) {
    const deleteObservable: Observable<any> = this.httpClientService.deleteRange<any>({
      controller: "orders",
      action: "deleterange"
    }, {
      orderIds
    });

    await firstValueFrom(deleteObservable);
  }
}
