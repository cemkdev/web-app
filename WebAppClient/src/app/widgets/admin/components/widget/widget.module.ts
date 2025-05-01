import { NgModule } from '@angular/core';
import { CommonModule, NgComponentOutlet } from '@angular/common';
import { WidgetComponent } from './widget.component';

@NgModule({
  declarations: [
    WidgetComponent
  ],
  imports: [
    CommonModule,
    NgComponentOutlet
  ],
  exports: [
    WidgetComponent
  ]
})
export class WidgetModule { }
