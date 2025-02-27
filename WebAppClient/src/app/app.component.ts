import { AfterViewInit, Component, effect, inject, signal, ViewEncapsulation } from '@angular/core';
import { ThemeService } from './services/theme.service';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  readonly themeService = inject(ThemeService);

  // darkMode = signal(false);

  // setDarkMode = effect(() => {
  //   document.documentElement.classList.toggle('dark', this.darkMode());
  // });

  menuItems = signal<MenuItem[]>([
    {
      icon: 'home',
      label: 'Home',
      route: 'home',
    },
    {
      icon: 'category',
      label: 'Products',
      route: 'products',
    },
    {
      icon: 'shopping_cart',
      label: 'Basket',
      route: 'basket',
    },
    {
      icon: 'admin_panel_settings',
      label: 'Admin',
      route: 'admin',
    },
  ]);
}
