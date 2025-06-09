import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerType } from '../../../base/base.component';
import { Update_Product } from '../../../contracts/product/update_product';
import { ProductService } from '../../../services/common/models/product.service';

@Component({
  selector: 'app-scan-qrcode-dialog',
  standalone: false,
  templateUrl: './scan-qrcode-dialog.component.html'
})
export class ScanQrcodeDialogComponent extends BaseDialog<ScanQrcodeDialogComponent> implements OnInit, OnDestroy {

  productForm!: FormGroup;

  constructor(
    dialogRef: MatDialogRef<ScanQrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScanQrCodeProductState | string,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    super(dialogRef)
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
  }

  @ViewChild("action", { static: true }) action: NgxScannerQrcodeComponent;

  ngOnInit(): void {
    this.productForm = this.fb.group({
      stock: ['', [Validators.required, Validators.min(0)]]
    });
    this.action.start();
  }

  ngOnDestroy(): void {
    this.action.stop();
  }

  // Get Scanner Value & Update Stock Value with FormInput
  async onScan(res: any, action?: any) {
    this.spinner.show(SpinnerType.BallAtom);

    if (res && res.length) {
      const { value } = res[0];
      value && action;
      const jsonData = JSON.parse(value);

      if (this.productForm.valid) {
        const formValue = this.productForm.value;
        const update_product = new Update_Product();
        Object.assign(update_product, {
          ...jsonData,
          stock: parseInt(formValue.stock)
        });
        this.productService.update(update_product, () => {
          this.spinner.hide(SpinnerType.BallAtom);
          action.stop();
          this.alertify.message(`${jsonData.Name} has been successfully updated.`, {
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          });
          this.dialogRef.close('scanned&updated');
        }, errorMessage => {
          this.spinner.hide(SpinnerType.BallAtom);
          action.stop();
          this.alertify.message(errorMessage, {
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          });
          this.dialogRef.close(errorMessage);
        });
      }
      else {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("Please enter a valid stock value.", {
          dismissOthers: true,
          messageType: MessageType.Warning,
          position: Position.TopRight
        });
      }
    }
  }
}

export enum ScanQrCodeProductState {
  Close
}

