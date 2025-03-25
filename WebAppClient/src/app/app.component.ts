import { Component, inject, signal, ViewEncapsulation } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

// export interface MenuItem {
//   icon: string;
//   label: string;
//   route: string;
// }

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  readonly themeService = inject(ThemeService);

  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;

  constructor(private toastrService: CustomToastrService, private router: Router) {

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterPage = event.url.includes('register');
        this.isLoginPage = event.url.includes('login');
      }
    });

  }




  // menuItems = signal<MenuItem[]>([
  //   {
  //     icon: 'home',
  //     label: 'Home',
  //     route: 'home',
  //   },
  //   {
  //     icon: 'category',
  //     label: 'Products',
  //     route: 'products',
  //   },
  //   {
  //     icon: 'shopping_cart',
  //     label: 'Basket',
  //     route: 'basket',
  //   },
  //   {
  //     icon: 'admin_panel_settings',
  //     label: 'Admin',
  //     route: 'admin',
  //   },
  // ]);
}
