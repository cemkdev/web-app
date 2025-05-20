import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { List_Order, List_Order_VM, OrderStatusInfo } from '../../../../contracts/order/list_order';
import { DeleteDialogComponent, DeleteState } from '../../../../dialogs/delete-dialog/delete-dialog.component';
import { OrderService } from '../../../../services/common/models/order.service';
import { Router } from '@angular/router';
import { OrderStatusEnum } from '../../../../enums/order_status_enum';

declare var $: any;

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['select', 'index', 'orderCode', 'customerName', 'totalPrice', 'dateCreated', 'status', 'view', 'delete'];
  dataSource: MatTableDataSource<List_Order_VM> = null;
  selection = new SelectionModel<List_Order_VM>(true, []);

  orders: List_Order[];
  ordersVM: List_Order_VM[] = [];
  allOrders: { totalOrderCount: number, orders: List_Order[] };

  totalItemCount: number = 0;
  value = '';
  orderStatusEnum = OrderStatusEnum;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService,
    private router: Router
  ) {
    super(spinner);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  async toggleAllRows() {
    if (await this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  checkboxLabel(row?: List_Order_VM): string {
    if (!row) {
      const allSelected = this.selection.hasValue() && this.dataSource?.data.length === this.selection.selected.length;
      return `${allSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  clearFilter(input: HTMLInputElement) {
    this.value = '';
    input.value = '';
    const event = new Event('input');
    input.dispatchEvent(event); // Angular mat-table, filter property'ine bağlıysa bu yeterli olabilir.
    this.applyFilter({ target: input } as any); // elle tetiklenmiş gibi
  }

  async ngOnInit() {
    await this.getOrders();
    this.manipulateOrderData(this.allOrders.orders, this.allOrders.totalOrderCount);
  }

  async pageChanged() {
    await this.getOrders();
    this.manipulateOrderData(this.allOrders.orders, this.allOrders.totalOrderCount);
    this.selection.clear();
  }

  async getOrders() {
    this.showSpinner(SpinnerType.BallAtom);

    this.allOrders = await this.orderService.getAllOrders(
      this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 10,
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
  }

  manipulateOrderData(sourceData: List_Order[], totalOrderCount: number): void {
    this.ordersVM = [];

    for (let i = 0; i < sourceData.length; i++) {

      // Each Item Integer/Fraction Divisions
      let [totalPriceIntegerPart, totalPriceFractionPart] = sourceData[i].totalPrice.toFixed(2).split('.');
      if (totalPriceFractionPart == undefined)
        totalPriceFractionPart = "00";

      let manipulatedData = {
        id: sourceData[i].id,
        orderCode: sourceData[i].orderCode,
        customerName: sourceData[i].customerName,
        totalPrice: `${totalPriceIntegerPart}.${totalPriceFractionPart}`,
        dateCreated: this.formatDateParts(sourceData[i].dateCreated),
        status: this.getOrderStatusInfo(sourceData[i].statusId)
      };
      this.ordersVM.push(manipulatedData);
      this.dataSource = new MatTableDataSource<List_Order_VM>(this.ordersVM);
      this.paginator.length = totalOrderCount;
      this.totalItemCount = totalOrderCount;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'totalPrice':
            return parseFloat(item.totalPrice);
          case 'dateCreated':
            return item.dateCreated.rawDate;
          default:
            return item[property];
        }
      };
    }
  }

  formatDateParts(dateInput: Date | string): Partial<any> {
    const date = new Date(dateInput);

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' }); // Apr
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    const rawDate = dateInput;
    const formattedDate = `${day} ${month},${year}`;
    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return { rawDate, formattedDate, formattedTime };
  }

  async deleteSelectedOrders() {
    const selectedIds = this.selection.selected.map(product => product.id);

    if (selectedIds.length === 0) {
      this.alertifyService.message("No item selected.", {
        messageType: MessageType.Warning,
        position: Position.TopCenter
      });
      return;
    }

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      options: {
        width: '400px',
        height: '230px'
      },
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallAtom);

        try {
          await this.orderService.deleteRange(selectedIds);
          for (let id of selectedIds) {
            const btn: HTMLElement = document.querySelector(`tr[data-id="${id}"]`) as HTMLElement;
            if (btn) {
              $(btn).animate({
                left: '100%'
              }, 500, () => {
                $(btn).fadeOut(100);
              });
            }
          }
          this.selection.clear();
          await this.getOrders();
          this.manipulateOrderData(this.allOrders.orders, this.allOrders.totalOrderCount);
          this.alertifyService.message("Items successfully deleted.", {
            messageType: MessageType.Success,
            position: Position.TopRight
          });
        } catch (error) {
          this.alertifyService.message("An error occurred while deleting items.", {
            messageType: MessageType.Error,
            position: Position.TopRight
          });
        } finally {
          this.hideSpinner(SpinnerType.BallAtom);
        }
      }
    });
  }

  viewOrderDetail(id: string) {
    this.router.navigate(['/admin/orders/order-detail/', id]);
  }

  getOrderStatusInfo(statusId: number): OrderStatusInfo {
    let badgeClass = 'badge-unknown';
    let statusText = 'Unknown';

    const statusEnumKeys = Object.keys(this.orderStatusEnum).filter(key => !isNaN(Number(key)));
    statusEnumKeys.forEach(key => {
      const currentStatusId = Number(key);
      if (currentStatusId === statusId) {
        badgeClass = `badge-${OrderStatusEnum[currentStatusId].toLowerCase()}`;  // 'badge-cancelled', 'badge-pending' gibi
        statusText = OrderStatusEnum[currentStatusId] ?? 'Unknown';
      }
    });
    return { badgeClass, statusText };
  }
}
