import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  collapsed = signal(false);
  isOverlayVisible = true;
  private layoutSubscription: any; // Track screen size with BreakpointObserver

  constructor(private breakpointObserver: BreakpointObserver) { }

  // We are receiving the boolean value from the child component.
  onCollapseChange(collapseStatus: boolean) {
    this.collapsed.set(collapseStatus);
  }

  sidenavWidth = computed(() => this.collapsed() ? 'auto' : 'auto');

  get collapsedClass() {
    return this.collapsed() ? 'collapsed' : 'expanded';
  }

  ngOnInit(): void {
    this.layoutSubscription = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe(result => {
        if (result.matches) {
          this.collapsed.set(!this.collapsed());
          this.isOverlayVisible = true;
        } else {
          this.isOverlayVisible = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.layoutSubscription) {
      this.layoutSubscription.unsubscribe();
    }
  }

}
