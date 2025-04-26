import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { List_Products } from '../../../../contracts/product/list_products';
import { ProductService } from '../../../../services/common/models/product.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from '../../../../services/common/dialog.service';
import { SelectProductImageDialogComponent } from '../../../../dialogs/product-dialogs/select-product-image-dialog/select-product-image-dialog.component';
import { CreateProductDialogComponent } from '../../../../dialogs/product-dialogs/create-product-dialog/create-product-dialog.component';
import { UpdateProductDialogComponent } from '../../../../dialogs/product-dialogs/update-product-dialog/update-product-dialog.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { DeleteDialogComponent, DeleteState } from '../../../../dialogs/delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-list',
  standalone: false,
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['select', 'index', 'name', 'title', 'description', 'stock', 'price', 'rating', 'dateCreated', 'dateUpdated', 'images', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Products> = null;
  selection = new SelectionModel<List_Products>(true, []);
  totalItemCount: number = 0;
  value = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    spinner: NgxSpinnerService,
    private productService: ProductService,
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

  checkboxLabel(row?: List_Products): string {
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
    await this.getProducts();
  }

  async pageChanged() {
    await this.getProducts();
    this.selection.clear();
  }

  async getProducts() {
    this.showSpinner(SpinnerType.BallAtom);

    const allProducts: { totalProductCount: number, products: List_Products[] } = await this.productService.read(
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
    this.dataSource = new MatTableDataSource<List_Products>(allProducts.products);
    this.paginator.length = allProducts.totalProductCount;
    this.totalItemCount = this.paginator.length;
    this.dataSource.sort = this.sort;
  }

  editProductImages(id: string) {
    this.dialogService.openDialog({
      componentType: SelectProductImageDialogComponent,
      data: id,
      options: {
        width: '1200px',
        height: '650px'
      }
    });
  }

  createProduct() {
    const dialogRef = this.dialogService.openDialog({
      componentType: CreateProductDialogComponent,
      options: {
        width: '500px'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result == 'created') {
        await this.getProducts();
      }
      else if (result != null && result != 'created') {
        this.alertifyService.message(result, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    });
  }

  updateProduct(id: string) {
    const dialogRef = this.dialogService.openDialog({
      componentType: UpdateProductDialogComponent,
      data: id,
      options: {
        width: '500px'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result == 'updated') {
        await this.getProducts();
      }
      else if (result != null && result != 'updated') {
        this.alertifyService.message(result, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    });
  }

  async deleteSelectedProducts() {
    const selectedIds = this.selection.selected.map(product => product.id);

    if (selectedIds.length === 0) {
      this.alertifyService.message("No product selected.", {
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
          await this.productService.deleteRange(selectedIds);
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
          await this.getProducts();
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
