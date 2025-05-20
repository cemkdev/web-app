import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleManagementComponent } from './role-management.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DeleteDirectiveModule } from '../../../directives/admin/delete.directive.module';

@NgModule({
  declarations: [
    RoleManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: RoleManagementComponent }
    ]),
    MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule,
    MatTableModule, MatCheckboxModule,
    DeleteDirectiveModule,
    ReactiveFormsModule
  ]
})
export class RoleManagementModule { }
