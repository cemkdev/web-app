import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule } from '@angular/router';

// geçici
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    MatIcon, MatButtonModule, // geçici
    RouterModule.forChild([
      { path: "", component: DashboardComponent }
    ])
  ]
})
export class DashboardModule { }
