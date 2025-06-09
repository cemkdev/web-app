import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { QrCodeService } from '../../../services/common/qr-code.service';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { SpinnerType } from '../../../base/base.component';
import { Product_By_Id } from '../../../contracts/product/product_by_id';
import { ProductService } from '../../../services/common/models/product.service';

@Component({
  selector: 'app-qrcode-dialog',
  standalone: false,
  templateUrl: './qrcode-dialog.component.html'
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit {

  qrCodeSafeUrl: SafeUrl;
  product: Product_By_Id;
  productName: string;

  constructor(
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QrCodeProductState | string,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private productService: ProductService,
    private qrCodeService: QrCodeService,
    private domSanitizer: DomSanitizer
  ) {
    super(dialogRef)
  }

  async ngOnInit() {
    await this.getUrlFromQRCode(this.data as string);
    await this.getProductNameById(this.data as string);
  }

  async getUrlFromQRCode(productId: string) {
    this.spinner.show(SpinnerType.BallAtom);
    const qrCodeBlob: Blob = await this.qrCodeService.generateQRCode(productId);
    const url = URL.createObjectURL(qrCodeBlob);
    this.qrCodeSafeUrl = this.domSanitizer.bypassSecurityTrustUrl(url);
    this.spinner.hide(SpinnerType.BallAtom);
  }

  async getProductNameById(id: string) {
    this.product = await this.productService.readById(id,
      () => { },
      (errorMessage) => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    );
    this.productName = this.product.name;
  }
}

export enum QrCodeProductState {
  Close
}
