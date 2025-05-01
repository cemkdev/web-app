import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../services/admin/alertify.service';
import { BaseDialog } from '../base/base-dialog';

import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Order_Detail, OrderBasketItem } from '../../contracts/order/order_detail';
import { OrderService } from '../../services/common/models/order.service';
import { SpinnerType } from '../../base/base.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-order-detail-dialog',
  standalone: false,
  templateUrl: './order-detail-dialog.component.html'
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  displayedColumns: string[] = ['index', 'name', 'description', 'price', 'quantity', 'rating', 'totalPrice'];
  dataSource: MatTableDataSource<OrderBasketItem> = null;
  selection = new SelectionModel<OrderBasketItem>(true, []);
  order: Order_Detail;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService
  ) {
    super(dialogRef)
  }
  async ngOnInit() {
    await this.getOrderById(this.data as string);
  }

  async getOrderById(id: string) {
    this.spinner.show(SpinnerType.BallAtom);

    this.order = await this.orderService.getOrderById(id,
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
    this.dataSource = new MatTableDataSource<OrderBasketItem>(this.order.orderBasketItems);
    this.dataSource.sort = this.sort;
  }
}

export enum OrderDetailDialogState {
  Close, OrderReceived
}
