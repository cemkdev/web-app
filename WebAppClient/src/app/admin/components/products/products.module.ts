import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { DeleteDirective } from '../../../directives/admin/delete.directive';
import { DialogModule } from '../../../dialogs/dialog.module';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload.module';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ProductsComponent,
    CreateComponent,
    ListComponent,
    DeleteDirective,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: "", component: ProductsComponent }
    ]),
    MatSidenavModule, MatInputModule, MatFormFieldModule, MatButtonModule,
    MatTableModule, MatPaginatorModule, MatIconModule,
    FileUploadModule,
    DialogModule,
    MatDialogModule
  ]
})
export class ProductsModule { }
