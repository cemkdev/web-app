import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileUploadDialogComponent } from '../../../dialogs/file-upload-dialog/file-upload-dialog.component';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    FileUploadComponent,
    FileUploadDialogComponent
  ],
  imports: [
    CommonModule,
    NgxFileDropModule,
    MatButtonModule,
    MatDialogModule, //MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, // MatDialog
    MatIconModule
  ],
  exports: [
    FileUploadComponent
  ]
})
export class FileUploadModule { }
