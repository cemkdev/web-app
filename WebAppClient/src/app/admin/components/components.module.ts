import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomersModule } from './customers/customers.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RoleAccessModule } from './role-access/role-access.module';
import { RoleManagementModule } from './role-management/role-management.module';
import { UserManagementModule } from './user-management/user-management.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsModule,
    OrdersModule,
    CustomersModule,
    DashboardModule,
    RoleAccessModule,
    RoleManagementModule,
    UserManagementModule
  ]
})
export class ComponentsModule { }
