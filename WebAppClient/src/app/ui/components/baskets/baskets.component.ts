import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { BasketService } from '../../../services/common/models/basket.service';
import { List_Basket_Item } from '../../../contracts/basket/list_basket_item';
import { Update_Basket_Item } from '../../../contracts/basket/update_basket_item';
import { animate, group, state, style, transition, trigger } from '@angular/animations';

declare var $: any;

@Component({
  selector: 'app-baskets',
  standalone: false,
  templateUrl: './baskets.component.html',
  styleUrl: './baskets.component.scss'
})
export class BasketsComponent extends BaseComponent implements OnInit {

  basketItems: List_Basket_Item[];

  constructor(
    spinner: NgxSpinnerService,
    private basketService: BasketService
  ) {
    super(spinner);
  }

  async ngOnInit() {
    this.showSpinner(SpinnerType.BallAtom);
    await this.getBasketItems();
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async getBasketItems() {
    this.basketItems = await this.basketService.get();
  }

  async updateQuantity(basketItemId: string, quantity: number, productId: string) {
    this.showSpinner(SpinnerType.BallAtom);
    const basketItem: Update_Basket_Item = new Update_Basket_Item();
    basketItem.basketItemId = basketItemId;
    basketItem.quantity = quantity;
    basketItem.productId = productId;
    await this.basketService.updateQuantity(basketItem);
    await this.getBasketItems();
    this.hideSpinner(SpinnerType.BallAtom);
  }

  async removeBasketItem(basketItemId: string) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.basketService.remove(basketItemId);

    $("." + basketItemId).animate({
      right: '100%'
    }, 500, () => {
      $("." + basketItemId).fadeOut(200, this.hideSpinner(SpinnerType.BallAtom));
    });
  }
}
