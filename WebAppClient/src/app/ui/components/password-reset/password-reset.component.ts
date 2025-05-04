import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { AlertifyService, MessageType, Position } from '../../../services/admin/alertify.service';

@Component({
  selector: 'app-password-reset',
  standalone: false,
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent extends BaseComponent implements OnInit {

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    spinner: NgxSpinnerService,
    private userAuthService: UserAuthService,
    private alertifyService: AlertifyService
  ) {
    super(spinner);
  }

  goBack() {
    this.location.back();
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [""]
    });
  }

  onSubmit(email: string) {
    this.showSpinner(SpinnerType.BallAtom);

    this.userAuthService.passwordReset(email, () => {
      this.hideSpinner(SpinnerType.BallAtom);
      this.alertifyService.message("If an account exists with that email, a password reset link has been sent.", {
        messageType: MessageType.Notify,
        position: Position.TopCenter
      })
    });

  }
}
