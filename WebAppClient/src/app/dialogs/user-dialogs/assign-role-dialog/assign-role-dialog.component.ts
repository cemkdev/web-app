import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { UserService } from '../../../services/common/models/user.service';
import { SpinnerType } from '../../../base/base.component';
import { Role } from '../../../contracts/users/user_roles';

@Component({
  selector: 'app-assign-role-dialog',
  standalone: false,
  templateUrl: './assign-role-dialog.component.html'
})
export class AssignRoleDialogComponent extends BaseDialog<AssignRoleDialogComponent> implements OnInit {

  displayedColumns: string[] = ['roleName', 'select'];

  roles: Role[] = [];
  originalRoles: Role[] = [];

  constructor(
    dialogRef: MatDialogRef<AssignRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignRoleState | string,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private userService: UserService
  ) {
    super(dialogRef)
  }

  async ngOnInit() {
    await this.initializeComponent();
  }

  async initializeComponent() {
    await this.getRolesByUserId(this.data as string);
    this.originalRoles = this.copyRoles(this.roles); // Copy used for tracking changes.
  }

  async getRolesByUserId(userId: string) {
    this.spinner.show(SpinnerType.BallAtom);

    this.roles = await this.userService.getRolesByUserId(userId,
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
  }

  hasChanges(): boolean {
    if (!this.originalRoles || this.originalRoles.length !== this.roles.length) {
      // If not suitable for comparison, consider it as a change.
      return false;
    }

    return this.roles.some((role, i) =>
      role.isAssigned !== this.originalRoles[i].isAssigned
    );
  }
  private copyRoles(roles: Role[]): Role[] {
    return roles.map(role => ({
      roleId: role.roleId,
      roleName: role.roleName,
      isAssigned: role.isAssigned
    }));
  }

  async assignRolesToUser() {
    this.spinner.show(SpinnerType.BallAtom);
    const selectedRoles = this.roles
      .filter(role => role.isAssigned)
      .map(role => role.roleName);

    await this.userService.assignRoleToUser(this.data as string, selectedRoles, async () => {
      this.spinner.hide(SpinnerType.BallAtom);
      this.alertify.message("Roles has been successfully assigned.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      await this.initializeComponent();
      //this.dialogRef.close('updated');
    }, async errorMessage => {
      this.spinner.hide(SpinnerType.BallAtom);
      this.alertify.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
      });
      await this.initializeComponent();
      //this.dialogRef.close(errorMessage);
    });
  }
}

export enum AssignRoleState {
  Close
}
