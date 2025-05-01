import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-order-customer',
  standalone: false,
  templateUrl: './order-customer.component.html'
})
export class OrderCustomerComponent {
  @Input() orderId!: string;

}
