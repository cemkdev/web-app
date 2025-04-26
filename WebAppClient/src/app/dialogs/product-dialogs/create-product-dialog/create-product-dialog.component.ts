import { Component, Inject, inject, model, OnInit, signal } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Create_Product } from '../../../contracts/product/create_product';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProductService } from '../../../services/common/models/product.service';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { SpinnerType } from '../../../base/base.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-product-dialog',
  standalone: false,
  templateUrl: './create-product-dialog.component.html',
  styleUrl: './create-product-dialog.component.scss'
})
export class CreateProductDialogComponent extends BaseDialog<CreateProductDialogComponent> implements OnInit {

  productForm!: FormGroup;

  constructor(
    dialogRef: MatDialogRef<CreateProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateProductState | string,
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

  ngOnInit(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    });
  }

  createProduct(): void {
    if (this.productForm.valid) {
      this.spinner.show(SpinnerType.BallAtom);

      const formValue = this.productForm.value;
      const create_product = new Create_Product();
      Object.assign(create_product, {
        ...formValue,
        stock: parseInt(formValue.stock),
        price: parseFloat(formValue.price)
      });

      this.productService.create(create_product, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("The product has been successfully added.", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
        this.dialogRef.close('created');
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

export enum CreateProductState {
  Close
}
