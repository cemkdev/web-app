import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Create_Basket_Item } from '../../../contracts/basket/create_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  constructor(
    private httpClientService: HttpClientService
  ) { }

  // GET
  async get(): Promise<List_Basket_Item[]> {
    const observable: Observable<List_Basket_Item[]> = this.httpClientService.get({
      controller: "baskets",
      action: "get-all-basket-items"
    });
    return await firstValueFrom(observable);
  }

  // POST
  async add(basketItem: Create_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "baskets",
      action: "add-item-to-basket"
    }, basketItem);
    await firstValueFrom(observable);
  }

  // UPDATE
  async updateQuantity(basketItem: Update_Basket_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.put({
      controller: "baskets",
      action: "update-basket-item-quantity"
    }, basketItem);
    await firstValueFrom(observable);
  }

  // REMOVE
  async remove(basketItemId: string): Promise<void> {
    const observable: Observable<any> = this.httpClientService.delete({
      controller: "baskets",
      action: "remove-basket-item-by-id"
    }, basketItemId);
    await firstValueFrom(observable);
  }
}
