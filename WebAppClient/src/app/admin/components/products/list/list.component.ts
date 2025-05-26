import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { List_Product, List_Product_Admin_VM } from '../../../../contracts/product/list_products';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['select', 'index', 'name', 'description', 'stock', 'price', 'rating', 'dateCreated', 'dateUpdated', 'images', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Product_Admin_VM> = null;
  selection = new SelectionModel<List_Product_Admin_VM>(true, []);

  products: List_Product[];
  productsVM: List_Product_Admin_VM[] = [];
  allProducts: { totalProductCount: number, products: List_Product[] };

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

  checkboxLabel(row?: List_Product_Admin_VM): string {
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
    await this.initializeComponent();
  }

  async initializeComponent() {
    await this.getProducts();
    this.manipulateProductData(this.allProducts.products, this.allProducts.totalProductCount);
  }

  async pageChanged() {
    await this.getProducts();
    this.manipulateProductData(this.allProducts.products, this.allProducts.totalProductCount);
    this.selection.clear();
  }

  async getProducts() {
    this.showSpinner(SpinnerType.BallAtom);

    this.allProducts = await this.productService.read(
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

  manipulateProductData(sourceData: List_Product[], totalProductCount: number): void {
    this.productsVM = [];

    for (let i = 0; i < sourceData.length; i++) {
      this.getStars(sourceData[i].rating);

      // Each Item Integer/Fraction Divisions
      let [priceIntegerPart, priceFractionPart] = sourceData[i].price.toString().split('.');
      if (priceFractionPart == undefined)
        priceFractionPart = "00";

      let manipulatedData = {
        id: sourceData[i].id,
        name: sourceData[i].name,
        stock: sourceData[i].stock,
        price: `${priceIntegerPart}.${priceFractionPart}`,
        dateCreated: this.formatDateParts(sourceData[i].dateCreated),
        dateUpdated: this.formatDateParts(sourceData[i].dateUpdated),
        title: sourceData[i].title,
        description: sourceData[i].description,
        rating: this.getStars(sourceData[i].rating),
      };
      this.productsVM.push(manipulatedData);
      this.dataSource = new MatTableDataSource<List_Product_Admin_VM>(this.productsVM);
      this.paginator.length = totalProductCount;
      this.totalItemCount = totalProductCount;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'price':
            return parseFloat(item.price);
          case 'dateCreated':
            return item.dateCreated.rawDate;
          case 'dateUpdated':
            return item.dateUpdated.rawDate;
          case 'rating':
            return item.rating.rating;
          default:
            return item[property];
        }
      };
    }
  }

  getStars(rating: number): Partial<any> {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push('star');
      } else if (rating >= i - 0.5) {
        stars.push('star_half');
      } else {
        stars.push('star_outline');
      }
    }
    return {
      stars, rating
    };
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
        await this.initializeComponent();
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
        this.manipulateProductData(this.allProducts.products, this.allProducts.totalProductCount);
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

          await this.initializeComponent();

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
