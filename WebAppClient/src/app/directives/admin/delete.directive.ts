import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { SpinnerType } from '../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { HttpClientService } from '../../services/common/http-client.service';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogService } from '../../services/common/dialog.service';

declare var $: any;

@Directive({
  selector: '[appDelete]',
  standalone: false
})
export class DeleteDirective {

  @Input() controller: string; // We send the 'controller' information here for wherever this directive will be used.
  @Output() callback: EventEmitter<any> = new EventEmitter(); // Delete Button CallBack Func to renew list after deleting

  constructor(
    private element: ElementRef,
    private httpClientService: HttpClientService,
    private spinner: NgxSpinnerService,
    private alertifyService: AlertifyService,
    readonly dialog: MatDialog,
    private dialogService: DialogService
  ) { }

  // DELETE
  @HostListener("click")
  async onclick() {

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        const btn: HTMLButtonElement = this.element.nativeElement;
        //await this.productService.delete(btn.parentElement.id);
        this.httpClientService.delete({
          controller: this.controller
        }, btn.parentElement.id).subscribe(data => {
          $(btn.parentElement.parentElement).animate({
            left: '100%'
          }, 300, () => {
            $(btn.parentElement.parentElement).fadeOut(100, () => {
              this.callback.emit();
              this.alertifyService.message("Item has been successfully deleted.", {
                dismissOthers: true,
                messageType: MessageType.Success,
                position: Position.TopRight
              })
            });
          });
        }, (errorResponse: HttpErrorResponse) => {
          this.spinner.hide(SpinnerType.BallAtom);
          this.alertifyService.message("An error occurred and 'item' could not be deleted.", {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
        });
      }
    });
  }



  // // Delete-Dialog
  // openDialog(afterClosed: any): void {
  //   const dialogRef = this.dialog.open(DeleteDialogComponent, {
  //     width: 'auto',
  //     data: DeleteState.Yes
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result == DeleteState.Yes) {
  //       afterClosed();
  //     }
  //   });
  // }
}
