import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidLinkComponent } from './invalid-link.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    InvalidLinkComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: InvalidLinkComponent }
    ])
  ],
  exports: [
    InvalidLinkComponent
  ]
})
export class InvalidLinkModule { }
