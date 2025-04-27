import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersComponent } from './orders.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from '@angular/cdk/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';

@NgModule({
  declarations: [
    OrdersComponent,
    ListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: OrdersComponent }
    ]),
    FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule,
    DialogModule, MatDialogModule,
    MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatCheckboxModule, MatSortModule,
    MatTooltipModule,
    DeleteDirectiveModule
  ]
})
export class OrdersModule { }
