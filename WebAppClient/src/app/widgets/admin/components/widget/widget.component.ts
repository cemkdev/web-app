import { Component, ComponentRef, inject, input, ViewChild, ViewContainerRef } from '@angular/core';
import { Widget } from '../../models/order-detail';

@Component({
  selector: 'app-widget',
  standalone: false,
  template: `
    <div class="container j-widget mat-elevation-z3">
      <span class="m-0">{{ data().label }}</span>
      <ng-template #container></ng-template>
    </div>
  `,
  styles: `
    :host {

      display: block;
      border-radius: 0.375rem;
    }
    .container {
      position: relative;
      height: auto;
      width: 100%;
      padding: 0;
      // padding: 10px;
      box-sizing: border-box;
      border-radius: inherit;
      overflow: hidden;
      span {
          font-size: 20px;
          font-weight: 400;
      }
    }
  `,
  host: {
    '[style.grid-area]': '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)'
  }
})
export class WidgetComponent {
  data = input.required<Widget>();

  @ViewChild('container', { read: ViewContainerRef }) containerRef!: ViewContainerRef;

  ngAfterViewInit(): void {
    const compRef: ComponentRef<unknown> = this.containerRef.createComponent(this.data().content);

    if (this.data().inputs) {
      Object.entries(this.data().inputs).forEach(([key, value]) => {
        (compRef.instance as any)[key] = value;
      });
    }
  }
}
