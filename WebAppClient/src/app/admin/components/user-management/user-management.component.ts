import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { DialogService } from '../../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../../../dialogs/delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['select', 'index', 'firstName', 'lastName', 'userName', 'email', 'phoneNumber', 'twoFactorEnabled', 'dateCreated', 'dateUpdated', 'show-edit', 'delete'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource([
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      userName: 'jdoe',
      email: 'jdoe@example.com',
      phoneNumber: '+1-555-1234',
      twoFactorEnabled: true,
      dateCreated: '2024-01-10',
      dateUpdated: '2024-03-15'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      userName: 'jsmith',
      email: 'jsmith@example.com',
      phoneNumber: '+1-555-5678',
      twoFactorEnabled: false,
      dateCreated: '2024-01-10',
      dateUpdated: '2024-03-15'
    },
    {
      id: 3,
      firstName: 'Alice',
      lastName: 'Johnson',
      userName: 'alicej',
      email: 'alice@example.com',
      phoneNumber: '+1-555-9012',
      twoFactorEnabled: true,
      dateCreated: '2024-01-10',
      dateUpdated: '2024-03-15'
    }
  ]);
  selection = new SelectionModel<any>(true, []);

  users: any[];
  usersVM: any[] = [];
  allUsers: { totalUserCount: number, users: any[] };

  totalItemCount: number = 0;
  value = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    spinner: NgxSpinnerService,
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

  checkboxLabel(row?: any): string {
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
    await this.initializePage();
  }

  async pageChanged() {
    await this.initializePage();
    this.selection.clear();
  }

  async initializePage() {
    // await this.getUsers();
    // this.manipulateUserData(this.allUsers.products, this.allUsers.totalProductCount);
  }

  async getUsers() {
    this.showSpinner(SpinnerType.BallAtom);

  }

  manipulateUserData(sourceData: any[], totalUserCount: number): void {
    this.usersVM = [];

    for (let i = 0; i < sourceData.length; i++) {

      let manipulatedData = {
        id: sourceData[i].id,
        name: sourceData[i].name,
        stock: sourceData[i].stock,
        dateCreated: this.formatDateParts(sourceData[i].dateCreated),
        dateUpdated: this.formatDateParts(sourceData[i].dateUpdated),
        title: sourceData[i].title,
        description: sourceData[i].description,
      };
      this.usersVM.push(manipulatedData);
      this.dataSource = new MatTableDataSource<any>(this.usersVM);
      this.paginator.length = totalUserCount;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'dateCreated':
            return item.dateCreated.rawDate;
          case 'dateUpdated':
            return item.dateUpdated.rawDate;
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

  updateUser(id: string) {

  }

  async deleteSelectedUsers() {
    const selectedIds = this.selection.selected.map(user => user.id);

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
