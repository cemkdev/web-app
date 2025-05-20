import { model, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './ui/components/home/home.component';
import { authGuard } from './guards/common/auth.guard';

const routes: Routes = [
  {
    path: "admin", component: LayoutComponent, children: [
      { path: "", component: DashboardComponent, canActivate: [authGuard] },
      { path: "customers", loadChildren: () => import("./admin/components/customers/customers.module").then(module => module.CustomersModule), canActivate: [authGuard] },
      { path: "products", loadChildren: () => import("./admin/components/products/products.module").then(module => module.ProductsModule), canActivate: [authGuard] },
      { path: "orders", loadChildren: () => import("./admin/components/orders/orders.module").then(module => module.OrdersModule), canActivate: [authGuard] },
      { path: "authorize-menu", loadChildren: () => import("./admin/components/authorize-menu/authorize-menu.module").then(module => module.AuthorizeMenuModule), canActivate: [authGuard] },

      {
        path: "administration", children: [
          { path: "roles", loadChildren: () => import("./admin/components/role-management/role-management.module").then(m => m.RoleManagementModule), canActivate: [authGuard] },
          { path: "role-access", loadChildren: () => import("./admin/components/role-access/role-access.module").then(m => m.RoleAccessModule), canActivate: [authGuard] },
          { path: "users", loadChildren: () => import("./admin/components/user-management/user-management.module").then(m => m.UserManagementModule), canActivate: [authGuard] },
          { path: "", redirectTo: "roles", pathMatch: "full" } // Default route for administration
        ]
      }

    ], canActivate: [authGuard]
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: "", component: HomeComponent },
  { path: "basket", loadChildren: () => import("./ui/components/baskets/baskets.module").then(module => module.BasketsModule) },
  { path: "products", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
  { path: "products/:pageNo", loadChildren: () => import("./ui/components/products/products.module").then(module => module.ProductsModule) },
  { path: "register", loadChildren: () => import("./ui/components/register/register.module").then(module => module.RegisterModule) },
  { path: "invalid", loadChildren: () => import("./ui/components/invalid-link/invalid-link.module").then(module => module.InvalidLinkModule) },
  { path: "login", loadChildren: () => import("./ui/components/login/login.module").then(module => module.LoginModule) },
  { path: "password-reset", loadChildren: () => import("./ui/components/password-reset/password-reset.module").then(module => module.PasswordResetModule) },
  { path: "password-update/:userId/:resetToken", loadChildren: () => import("./ui/components/password-update/password-update.module").then(module => module.PasswordUpdateModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
