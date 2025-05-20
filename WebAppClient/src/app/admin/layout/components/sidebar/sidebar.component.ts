import { Component, computed, EventEmitter, Input, Output, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { FocusMonitor } from '@angular/cdk/a11y';
import { animate, state, style, transition, trigger } from '@angular/animations';

export interface MenuItem {
  icon: string;
  iconClass: string;
  label: string;
  route: string;
  exact: boolean;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  animations: [
    trigger('slideVertical', [
      transition(':enter', [
        style({ height: '0', opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ height: '0', opacity: 0 }))
      ])
    ]),
    trigger('rotateIcon', [
      state('true', style({ transform: 'rotate(90deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('200ms ease-in-out'))
    ])
  ]
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
      icon: 'settings',
      iconClass: '',
      label: 'Administration',
      route: '',
      exact: true,
      subItems: [
        {
          icon: 'security',
          iconClass: '',
          label: 'Roles',
          route: '/admin/administration/roles',
          exact: true
        },
        {
          icon: 'lock',
          iconClass: '',
          label: 'Role Access',
          route: '/admin/administration/role-access',
          exact: true
        },
        {
          icon: 'person',
          iconClass: '',
          label: 'Users',
          route: '/admin/administration/users',
          exact: true
        }
      ]
    },
    {
      icon: 'domain',
      iconClass: '',
      label: 'Show the Main Site',
      route: '',
      exact: true
    }
  ]);

  isOrdersRouteActive(): boolean {
    return this.router.url.startsWith('/admin/orders/order-detail');
  }

  isAdministrationRouteActive(): boolean {
    return this.router.url.startsWith('/admin/administration/');
  }

  nestedMenuOpen = signal(this.isAdministrationRouteActive());
  toggleNested(item: any) {
    if (!item.subItems)
      return;
    this.nestedMenuOpen.set(!this.nestedMenuOpen());
  }
}
