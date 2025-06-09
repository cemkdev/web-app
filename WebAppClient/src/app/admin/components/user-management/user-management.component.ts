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
import { List_User, List_User_VM } from '../../../contracts/users/list_user';
import { UserService } from '../../../services/common/models/user.service';
import { AssignRoleDialogComponent } from '../../../dialogs/user-dialogs/assign-role-dialog/assign-role-dialog.component';

declare var $: any;

@Component({
  selector: 'app-user-management',
  standalone: false,
  templateUrl: './user-management.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserManagementComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['select', 'index', 'user', 'userName', 'email', 'phoneNumber', 'twoFactorEnabled', 'dateCreated', 'dateUpdated', 'assignRole', 'show-edit', 'delete'];
  // 'firstName', 'lastName', 'userName' => 'user': first + last dite birleştir. UserName'e gerek yok. Bunlar detay ekranında gözükecek.
  dataSource: MatTableDataSource<List_User_VM> = null;
  selection = new SelectionModel<List_User_VM>(true, []);

  users: List_User[];
  usersVM: List_User_VM[] = [];
  allUsers: { totalUserCount: number, users: List_User[] };

  totalItemCount: number = 0;
  value = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    spinner: NgxSpinnerService,
    private alertifyService: AlertifyService,
    private dialogService: DialogService,
    private userService: UserService
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

  checkboxLabel(row?: List_User_VM): string {
    if (!row) {
      const allSelected = this.selection.hasValue() && this.dataSource?.data.length === this.selection.selected.length;
      return `${allSelected ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    debugger
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
    await this.getUsers();
    this.manipulateUserData(this.allUsers.users, this.allUsers.totalUserCount);
  }

  async getUsers() {
    this.showSpinner(SpinnerType.BallAtom);

    this.allUsers = await this.userService.getAllUsers(
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

  manipulateUserData(sourceData: List_User[], totalUserCount: number): void {
    this.usersVM = [];

    for (let i = 0; i < sourceData.length; i++) {

      let manipulatedData = {
        id: sourceData[i].id,
        user: `${sourceData[i].firstName} ${sourceData[i].lastName}`,
        // firstName: sourceData[i].firstName,
        // lastName: sourceData[i].lastName,
        userName: sourceData[i].userName,
        email: sourceData[i].email,
        phoneNumber: this.formatPhoneNumber(sourceData[i].phoneNumber),
        twoFactorEnabled: sourceData[i].twoFactorEnabled,
        dateCreated: this.formatDateParts(sourceData[i].dateCreated),
        dateUpdated: this.formatDateParts(sourceData[i].dateUpdated)
      };
      this.usersVM.push(manipulatedData);
      this.dataSource = new MatTableDataSource<List_User_VM>(this.usersVM);
      this.paginator.length = totalUserCount;
      this.totalItemCount = totalUserCount;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'user':
            return item.user;
          case 'phoneNumber':
            return item.phoneNumber;
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

  formatPhoneNumber(rawNumber: string): string {
    if (!rawNumber) return '';

    const cleaned = rawNumber.replace(/\D/g, '');

    if (cleaned.length !== 10) return rawNumber;

    const part1 = cleaned.slice(0, 3);
    const part2 = cleaned.slice(3, 6);
    const part3 = cleaned.slice(6);

    return `${part1}-${part2}-${part3}`;
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

  assignRole(id: string) {
    const dialogRef = this.dialogService.openDialog({
      componentType: AssignRoleDialogComponent,
      data: id,
      options: {
        width: '500px',
        maxHeight: '650px'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result == 'updated') {
        await this.initializePage();
      }
      else if (result != null && result !== '' && result != 'updated') {
        this.alertifyService.message(result, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
      }
    });
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
