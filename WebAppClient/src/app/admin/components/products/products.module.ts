import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';

import { DeleteDirective } from '../../../directives/admin/delete.directive';
import { DialogModule } from '../../../dialogs/dialog.module';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProductsComponent,
    ListComponent,
    DeleteDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ProductsComponent }
    ]),
    FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule,
    DialogModule, MatDialogModule,
    MatTableModule, MatPaginatorModule, MatIconModule, MatCardModule, MatCheckboxModule, MatSortModule,
    FileUploadModule,
    MatTooltipModule
  ]
})
export class ProductsModule { }
