import { Component, Inject, OnInit, Output, signal } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../../services/common/file-upload/file-upload.component';
import { ProductService } from '../../../services/common/models/product.service';
import { List_Product_Image } from '../../../contracts/product/list_product_image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../../base/base.component';
import { DialogService } from '../../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-select-product-image-dialog',
  standalone: false,
  templateUrl: './select-product-image-dialog.component.html'
})
export class SelectProductImageDialogComponent extends BaseDialog<SelectProductImageDialogComponent> implements OnInit {

  images: List_Product_Image[];

  constructor(
    dialogRef: MatDialogRef<SelectProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectProductImageState | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) {
    super(dialogRef)
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: ".png, .jpg, .jpeg",
    controller: "products",
    action: "upload",
    isAdminPage: true,
    queryString: `id=${this.data}`
  };

  checkedValues: boolean[] = [];

  async ngOnInit() {
    await this.initializeComponent();
  }

  async initializeComponent() {
    await this.getImages();
  }

  async onUploadFinished(result: 'success' | 'error') {
    await this.initializeComponent();
  }

  async getImages() {
    this.spinner.show(SpinnerType.BallAtom);
    this.images = await this.productService.readImages(this.data as string, () => this.spinner.hide(SpinnerType.BallAtom));
    this.checkedValues = this.images.map(c => c.coverImage);
  }

  async deleteImage(imageId: string, event: any) {

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      options: {
        width: '400px',
        height: '230px'
      },
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);

        await this.productService.deleteImage(this.data as string, imageId, async () => {
          this.spinner.hide(SpinnerType.BallAtom)

          const deleteBtn = event.srcElement as HTMLElement;
          const cardElement = $(deleteBtn.parentElement.parentElement.parentElement)
          cardElement.animate({
            opacity: 0,
            scale: 0.6
          }, 1000, 'swing', () => {
            cardElement.remove();
          });
          await this.initializeComponent();
        });
      }
    })
  }

  async makeCoverImage(imageId: string) {
    this.spinner.show(SpinnerType.BallAtom);
    await this.productService.changeCoverImage(imageId, this.data as string, () => {
      this.spinner.hide(SpinnerType.BallAtom);
    })
    await this.initializeComponent();
  }
}

export enum SelectProductImageState {
  Close
}