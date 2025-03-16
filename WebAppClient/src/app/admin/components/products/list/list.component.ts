import { Component, OnInit, ViewChild } from '@angular/core';
import { List_Products } from '../../../../contracts/list_products';
import { ProductService } from '../../../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../../../services/common/dialog.service';
import { SelectProductImageDialogComponent } from '../../../../dialogs/select-product-image-dialog/select-product-image-dialog.component';

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
  ) {
    super(spinner);
  }

  displayedColumns: string[] = ['name', 'stock', 'price', 'dateCreated', 'dateUpdated', 'images', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Products> = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    await this.getProducts();
  }

  async pageChanged() {
    await this.getProducts();
  }

  async getProducts() {
    this.showSpinner(SpinnerType.BallAtom);

    const allProducts: { totalCount: number, products: List_Products[] } = await this.productService.read(
      this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5,
      () => this.hideSpinner(SpinnerType.BallAtom),
      (errorMessage) => {
        this.hideSpinner(SpinnerType.BallAtom);
        this.alertifyService.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    );
    this.dataSource = new MatTableDataSource<List_Products>(allProducts.products);
    this.paginator.length = allProducts.totalCount;
  }

  editProductImages(id: string) {
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: 'auto',
        height: '500px'
      }
    });
  }
}
