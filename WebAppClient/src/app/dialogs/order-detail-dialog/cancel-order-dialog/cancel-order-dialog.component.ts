import { Component, Inject } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: false,
  templateUrl: './cancel-order-dialog.component.html'
})
export class CancelOrderDialogComponent extends BaseDialog<CancelOrderDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CancelOrderState
  ) {
    super(dialogRef);
  }

  cancel() {

  }
}

export enum CancelOrderState {
  Yes,
  No
}
