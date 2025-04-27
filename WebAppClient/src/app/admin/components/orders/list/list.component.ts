import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { List_Order } from '../../../../contracts/order/list_order';
import { DeleteDialogComponent, DeleteState } from '../../../../dialogs/delete-dialog/delete-dialog.component';
import { OrderService } from '../../../../services/common/models/order.service';

declare var $: any;

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['select', 'index', 'orderCode', 'userName', 'totalPrice', 'dateCreated', 'delete'];
  dataSource: MatTableDataSource<List_Order> = null;
  selection = new SelectionModel<List_Order>(true, []);
  totalItemCount: number = 0;
  value = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    spinner: NgxSpinnerService,
    private orderService: OrderService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService
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

  checkboxLabel(row?: List_Order): string {
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
  }

  async pageChanged() {
    await this.getOrders();
    this.selection.clear();
  }

  async getOrders() {
    this.showSpinner(SpinnerType.BallAtom);

    const allOrders: { totalOrderCount: number, orders: List_Order[] } = await this.orderService.getAllOrders(
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
    this.dataSource = new MatTableDataSource<List_Order>(allOrders.orders);
    this.paginator.length = allOrders.totalOrderCount;
    this.totalItemCount = this.paginator.length;
    this.dataSource.sort = this.sort;
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
}
