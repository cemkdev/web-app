import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { HomeModule } from './home/home.module';
import { BasketsModule } from './baskets/baskets.module';
import { RegisterModule } from './register/register.module';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PasswordUpdateModule } from './password-update/password-update.module';
import { InvalidLinkModule } from './invalid-link/invalid-link.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HomeModule,
    ProductsModule,
    BasketsModule,
    RegisterModule,
    PasswordResetModule,
    PasswordUpdateModule,
    InvalidLinkModule
  ],
  exports: [
    BasketsModule
  ]
})
export class ComponentsModule { }
