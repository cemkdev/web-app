import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { SelectProductImageDialogComponent } from './product-dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { CreateProductDialogComponent } from './product-dialogs/create-product-dialog/create-product-dialog.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { UpdateProductDialogComponent } from './product-dialogs/update-product-dialog/update-product-dialog.component';
import { OrderDetailDialogComponent } from './order-detail-dialog/order-detail-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectProductImageDialogComponent,
    CreateProductDialogComponent,
    UpdateProductDialogComponent,
    OrderDetailDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule, // MatDialog
    FileUploadModule,
    MatCardModule, MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTableModule, MatSortModule
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline', subscriptSizing: 'dynamic' },
    }
  ]
})
export class DialogModule { }
