import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from '@angular/cdk/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    UserManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: UserManagementComponent }
    ]),
    MatButtonModule, MatIconModule,
    DialogModule, MatDialogModule,
    MatTableModule, FormsModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatSortModule, MatPaginatorModule, MatTooltipModule,
    DeleteDirectiveModule
  ]
})
export class UserManagementModule { }
