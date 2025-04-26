import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDialogComponent, FileUploadDialogState } from '../../../dialogs/product-dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../dialog.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base.component';

@Component({
  selector: 'app-file-upload',
  standalone: false,
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss'
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService,
    readonly dialog: MatDialog,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService
  ) { }

  public files: NgxFileDropEntry[];
  @Input() options: Partial<FileUploadOptions>;

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;

    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.BallAtom)
        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, fileData).subscribe(data => {
          const successMessage: string = "The files have been successfully uploaded.";

          this.spinner.hide(SpinnerType.BallAtom);
          if (this.options.isAdminPage) {
            this.alertifyService.message(successMessage, {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            })
          } else {
            this.customToastrService.message(successMessage, "Great!", {
              messageType: ToastrMessageType.Success,
              position: ToastrPosition.TopRight
            });
          }
          this.spinner.hide(SpinnerType.BallAtom);
        }, (errorResponse: HttpErrorResponse) => {
          const errorMessage: string = "An error occurred and files could not be uploaded.";

          this.spinner.hide(SpinnerType.BallAtom);
          if (this.options.isAdminPage) {
            this.alertifyService.message(errorMessage, {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            })
          } else {
            this.customToastrService.message(errorMessage, "Oops!", {
              messageType: ToastrMessageType.Error,
              position: ToastrPosition.TopRight
            });
          }
        });
      }
    })
  }
}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string; // Ben kullanmayabilirim. Kaldırabiliriz bunu ileride.
  accept?: string;
  isAdminPage?: boolean = false; // We made this choice for now to separate the use of Alertify and Toastr. Normally, there wouldn't be such a setup with a 'main site' and 'admin panel'.
}
