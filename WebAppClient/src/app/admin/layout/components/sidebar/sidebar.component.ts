import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';

export interface MenuItem {
  icon: string;
  iconClass: string;
  label: string;
  route: string;
  exact: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  collapsed = signal(false);
  private layoutSubscription: any; // Track screen size with BreakpointObserver

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router
  ) { }

  ngOnInit() {
    this.layoutSubscription = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        if (result.matches) {
          // Collapse the sidenav when screen width is small
          this.collapsed.set(true);
        } else {
          // Expand the sidenav for larger screens
          this.collapsed.set(false);
        }
      });
  }

  ngOnDestroy() {
    if (this.layoutSubscription) {
      this.layoutSubscription.unsubscribe(); // Cleanup subscription when component is destroyed
    }
  }

  // We use EventEmitter to change the collapsed state.
  @Output() collapsedChange = new EventEmitter<boolean>();

  // We send the value to the parent with collapsedChange.
  emitCollapseChange() {
    this.collapsedChange.emit(this.collapsed());
  }

  get collapsedClass() {
    return this.collapsed() ? 'collapsed' : 'expanded';
  }

  isOrdersRouteActive(): boolean {
    return this.router.url.startsWith('/admin/orders/order-detail');
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      iconClass: '',
      label: 'Dashboard',
      route: '/admin',
      exact: true
    },
    {
      icon: 'group',
      iconClass: '',
      label: 'Customers',
      route: '/admin/customers',
      exact: true
    },
    {
      icon: 'inventory_2',
      iconClass: '',
      label: 'Products',
      route: '/admin/products',
      exact: true
    },
    {
      icon: 'inventory',
      iconClass: 'material-icons-outlined',
      label: 'Orders',
      route: '/admin/orders',
      exact: false
    },
    {
      icon: 'domain',
      iconClass: '',
      label: 'Show the Main Site',
      route: '',
      exact: true
    },
  ]);

  // menuItems: MenuItem[] = [
  //   {
  //     icon: 'dashboard',
  //     label: 'Dashboard',
  //     route: '/admin',
  //   },
  //   {
  //     icon: 'group',
  //     label: 'Customers',
  //     route: 'customers',
  //   },
  //   {
  //     icon: 'inventory_2',
  //     label: 'Products',
  //     route: 'products',
  //   },
  //   {
  //     icon: 'reorder',
  //     label: 'Orders',
  //     route: 'orders',
  //   },
  //   {
  //     icon: 'domain',
  //     label: 'Show the Main Site',
  //     route: '',
  //   },
  // ];
}
