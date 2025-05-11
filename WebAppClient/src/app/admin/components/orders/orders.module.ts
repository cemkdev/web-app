import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';
import { DetailComponent } from './detail/detail.component';
import { WidgetModule } from '../../../widgets/admin/components/widget/widget.module';
import { OrderItemsTableComponent } from './detail/widgets/order-items-table/order-items-table.component';
import { OrderCustomerComponent } from './detail/widgets/order-customer/order-customer.component';
import { OrderDetailService } from '../../../widgets/admin/services/order-detail.service';
import { OrderBillingAddressComponent } from './detail/widgets/order-billing-address/order-billing-address.component';
import { OrderShippingAddressComponent } from './detail/widgets/order-shipping-address/order-shipping-address.component';
import { OrderStatusComponent } from './detail/widgets/order-status/order-status.component';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
  declarations: [
    OrdersComponent,
    ListComponent,
    DetailComponent,
    OrderItemsTableComponent,
    OrderCustomerComponent,
    OrderBillingAddressComponent,
    OrderShippingAddressComponent,
    OrderStatusComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ListComponent },
      { path: 'order-detail/:id', component: DetailComponent }
    ]),
    FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule,
    DialogModule, MatDialogModule,
    MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatCheckboxModule, MatSortModule,
    MatTooltipModule,
    DeleteDirectiveModule,
    WidgetModule,
    MatExpansionModule
  ],
  providers: [OrderDetailService]
})
export class OrdersModule { }
