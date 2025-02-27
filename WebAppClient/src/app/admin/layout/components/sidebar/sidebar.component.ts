import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

export interface MenuItem {
  icon: string;
  label: string;
  route: string;
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

  constructor(private breakpointObserver: BreakpointObserver) { }

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

  menuItems = signal<MenuItem[]>([
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: '/admin',
    },
    {
      icon: 'group',
      label: 'Customers',
      route: '/admin/customers',
    },
    {
      icon: 'inventory_2',
      label: 'Products',
      route: '/admin/products',
    },
    {
      icon: 'shopping_basket',
      label: 'Orders',
      route: '/admin/orders',
    },
    {
      icon: 'domain',
      label: 'Show the Main Site',
      route: '',
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
