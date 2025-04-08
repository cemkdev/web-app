import { Component, EventEmitter, Output, output } from '@angular/core';
import { ProductService } from '../../../../services/common/models/product.service';
import { Create_Product } from '../../../../contracts/create_product';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';

@Component({
  selector: 'app-create',
  standalone: false,
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent extends BaseComponent {

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService
  ) {
    super(spinner)
  }

  @Output() createdProduct = new EventEmitter<Create_Product>();

  create(name: HTMLInputElement, title: HTMLInputElement, description: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {

    this.showSpinner(SpinnerType.BallAtom);

    const create_product: Create_Product = new Create_Product();
    create_product.name = name.value;
    create_product.title = title.value;
    create_product.description = description.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message("The product has been successfully added.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      this.createdProduct.emit(create_product);
    }, errorMessage => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      })
    });
  }
}
