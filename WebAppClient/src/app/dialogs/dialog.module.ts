import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';

@NgModule({
  declarations: [
    DeleteDialogComponent,
    FileUploadDialogComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, // MatDialog
  ]
})
export class DialogModule { }
