import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Update_Role } from '../../../contracts/role/update_role';
import { NgxSpinnerService } from 'ngx-spinner';
import { RoleService } from '../../../services/common/models/role.service';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerType } from '../../../base/base.component';

@Component({
  selector: 'app-update-role-dialog',
  standalone: false,
  templateUrl: './update-role-dialog.component.html'
})
export class UpdateRoleDialogComponent extends BaseDialog<UpdateRoleDialogComponent> implements OnInit {

  roleForm!: FormGroup;
  role: Update_Role;

  constructor(
    dialogRef: MatDialogRef<UpdateRoleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateRoleState | string,
    private spinner: NgxSpinnerService,
    private roleService: RoleService,
    private alertify: AlertifyService,
    private fb: FormBuilder
  ) {
    super(dialogRef)
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
  }

  async ngOnInit(): Promise<void> {
    try {
      await this.getProductById(this.data as string);
    } catch (e) {
      console.error('Role fetch error', e);
    } finally {
      this.fillForm();
    }
  }

  fillForm() {
    this.roleForm = this.fb.group({
      name: [this.role.name, Validators.required],
      isAdmin: [this.role.isAdmin]
    });
  }

  async getProductById(id: string) {
    this.spinner.show(SpinnerType.BallAtom);

    this.role = await this.roleService.readById(id,
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

  updateRole(): void {
    if (this.roleForm.valid) {
      this.spinner.show(SpinnerType.BallAtom);

      const formValue = this.roleForm.value;
      const update_role = new Update_Role();
      Object.assign(update_role, {
        ...formValue,
        id: this.data,
      });

      this.roleService.update(update_role, () => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message("The role has been successfully updated.", {
          dismissOthers: true,
          messageType: MessageType.Success,
          position: Position.TopRight
        });
        this.dialogRef.close('updated');
      }, errorMessage => {
        this.spinner.hide(SpinnerType.BallAtom);
        this.alertify.message(errorMessage, {
          dismissOthers: true,
          messageType: MessageType.Error,
          position: Position.TopRight
        });
        this.dialogRef.close(errorMessage);
      });
    }
  }
}

export enum UpdateRoleState {
  Close
}
