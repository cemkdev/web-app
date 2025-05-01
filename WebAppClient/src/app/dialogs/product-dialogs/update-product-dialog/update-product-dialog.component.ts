import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/common/models/product.service';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { BaseDialog } from '../../base/base-dialog';
import { SpinnerType } from '../../../base/base.component';
import { Update_Product } from '../../../contracts/product/update_product';
import { Product_By_Id } from '../../../contracts/product/product_by_id';

@Component({
  selector: 'app-update-product-dialog',
  standalone: false,
  templateUrl: './update-product-dialog.component.html'
})
export class UpdateProductDialogComponent extends BaseDialog<UpdateProductDialogComponent> implements OnInit {

  productForm!: FormGroup;
  product: Product_By_Id;

  constructor(
    dialogRef: MatDialogRef<UpdateProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateProductState | string,
    private spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService,
    private fb: FormBuilder
  ) {
    super(dialogRef)
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.getProductById(this.data as string);
    } catch (e) {
      console.error('Product fetch error', e);
    } finally {
      this.fillForm();
    }
  }

  fillForm() {
    this.productForm = this.fb.group({
      name: [this.product.name, Validators.required],
      title: [this.product.title, Validators.required],
      description: [this.product.description, Validators.required],
      stock: [this.product.stock, [Validators.required, Validators.min(0)]],
      price: [this.product.price, [Validators.required, Validators.min(0)]],
    });
  }

  async getProductById(id: string) {
    this.spinner.show(SpinnerType.BallAtom);

    this.product = await this.productService.readById(id,
      () => this.spinner.hide(SpinnerType.BallAtom),
      (errorMessage) => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    );
  }

  updateProduct(): void {
    if (this.productForm.valid) {
      this.spinner.show(SpinnerType.BallAtom);
      debugger
      const formValue = this.productForm.value;
      const update_product = new Update_Product();
      Object.assign(update_product, {
        ...formValue,
        id: this.data,
        stock: parseInt(formValue.stock),
        price: parseFloat(formValue.price)
      });

      this.productService.update(update_product, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("The product has been successfully updated.", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
        this.dialogRef.close('updated');
      }, errorMessage => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
        this.dialogRef.close(errorMessage);
      });
    }
  }
}

export enum UpdateProductState {
  Close
}
