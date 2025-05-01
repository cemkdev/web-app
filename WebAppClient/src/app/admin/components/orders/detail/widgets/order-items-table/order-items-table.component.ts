import { Component, Input, ViewChild } from '@angular/core';
import { OrderService } from '../../../../../../services/common/models/order.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../../../services/admin/alertify.service';
import { SpinnerType } from '../../../../../../base/base.component';
import { MatTableDataSource } from '@angular/material/table';
import { Order_Detail, OrderBasketItem_VM } from '../../../../../../contracts/order/order_detail';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-order-items-table',
  standalone: false,
  templateUrl: './order-items-table.component.html'
})
export class OrderItemsTableComponent {
  @Input() orderId!: string;

  displayedColumns: string[] = ['index', 'imagePath', 'productName', 'productDescription', 'itemPrice', 'quantity', 'rating', 'totalItemAmount'];
  dataSource: MatTableDataSource<OrderBasketItem_VM> = null;

  order: Order_Detail;
  orderVM: OrderBasketItem_VM[] = [];

  totalOrderAmount: string;
  sampleDiscount: string = "2.99";
  sampleEstimatedTax: string = "2.99";

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) { }

  async ngOnInit() {
    await this.getOrderById(this.orderId);
    this.getTotalPrice();
    this.manipulateBasketItemsData(this.order);
  }

  async getOrderById(id: string) {
    this.spinner.show(SpinnerType.BallAtom);

    this.order = await this.orderService.getOrderById(id,
      () => this.spinner.hide(SpinnerType.BallAtom),
      (errorMessage) => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    );
  }

  manipulateBasketItemsData(sourceData: Order_Detail): void {
    this.orderVM = [];

    for (let i = 0; i < sourceData.orderBasketItems.length; i++) {
      this.getStars(sourceData.orderBasketItems[i].rating);

      // Each Item Integer/Fraction Divisions
      let [itemIntegerPart, itemFractionPart] = sourceData.orderBasketItems[i].price.toString().split('.');
      if (itemFractionPart == undefined)
        itemFractionPart = "00";

      // Total Item Integer/Fraction Divisions
      let [totalItemIntegerPart, totalItemFractionPart] = (sourceData.orderBasketItems[i].price * sourceData.orderBasketItems[i].quantity).toString().split('.');
      if (totalItemFractionPart == undefined)
        totalItemFractionPart = "00";

      let manipulatedData = {
        imagePath: sourceData.orderBasketItems[i].orderProductImageFile != null ? sourceData.orderBasketItems[i].orderProductImageFile.path : "",
        productName: sourceData.orderBasketItems[i].name,
        productDescription: sourceData.orderBasketItems[i].description,
        itemPrice: `${itemIntegerPart}.${itemFractionPart}`,
        quantity: sourceData.orderBasketItems[i].quantity,
        rating: this.getStars(sourceData.orderBasketItems[i].rating),
        totalItemAmount: `${totalItemIntegerPart}.${totalItemFractionPart}`
      };
      this.orderVM.push(manipulatedData);
      this.dataSource = new MatTableDataSource<OrderBasketItem_VM>(this.orderVM);
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'itemPrice':
            return parseFloat(item.itemPrice);
          case 'quantity':
            return item.quantity;
          case 'rating':
            return item.rating.rating;
          case 'totalItemAmount':
            return item.totalItemAmount;
          default:
            return item[property];
        }
      };
    }
  }

  getStars(rating: number): Partial<any> {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('star');
      } else if (rating >= i - 0.5) {
        stars.push('star_half');
      } else {
        stars.push('star_outline');
      }
    }
    return {
      stars, rating
    };
  }

  // Total Order Amount Calculation and Integer/Fraction Divisions
  getTotalPrice() {
    let totalPrice: number = 0

    this.order.orderBasketItems.forEach(item => {

      totalPrice += item.price * item.quantity;
      totalPrice = parseFloat(totalPrice.toFixed(2));

      let [integerPart, fractionPart] = totalPrice.toString().split('.');
      if (fractionPart == undefined)
        fractionPart = "00";

      this.totalOrderAmount = `${integerPart}.${fractionPart}`;
    });
  }
}
