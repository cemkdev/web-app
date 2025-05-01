import { Injectable, signal } from '@angular/core';
import { Widget } from '../models/order-detail';
import { OrderItemsTableComponent } from '../../../admin/components/orders/detail/widgets/order-items-table/order-items-table.component';
import { OrderCustomerComponent } from '../../../admin/components/orders/detail/widgets/order-customer/order-customer.component';
import { OrderBillingAddressComponent } from '../../../admin/components/orders/detail/widgets/order-billing-address/order-billing-address.component';
import { OrderShippingAddressComponent } from '../../../admin/components/orders/detail/widgets/order-shipping-address/order-shipping-address.component';

@Injectable()
export class OrderDetailService {
  widgets = signal<Widget[]>([]);

  constructor() { }

  generateWidgets(orderId: string) {
    this.widgets.set([
      {
        id: 1,
        label: '',
        content: OrderItemsTableComponent,
        inputs: { orderId },
        rows: 3,
        columns: 4
      },
      {
        id: 2,
        label: '',
        content: OrderCustomerComponent,
        rows: 1,
        columns: 1
      },
      {
        id: 3,
        label: '',
        content: OrderBillingAddressComponent,
        rows: 1,
        columns: 1
      },
      {
        id: 4,
        label: '',
        content: OrderShippingAddressComponent,
        rows: 1,
        columns: 1
      }
    ]);
  }
}
