import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { UserService } from '../../../services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-password-update',
  standalone: false,
  templateUrl: './password-update.component.html',
  styleUrl: './password-update.component.scss'
})
export class PasswordUpdateComponent extends BaseComponent implements OnInit {

  form: FormGroup;
  state: boolean;


  constructor(
    private formBuilder: FormBuilder,
    spinner: NgxSpinnerService,
    private toastrService: CustomToastrService,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super(spinner);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      password: ["", [
        Validators.required,
        //Validators.minLength(8),
        Validators.maxLength(30),
        //Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\sa-zA-Z0-9]).{8,30}$/)
      ]],
      confirmPassword: ["", [
        Validators.required
      ]]
    }, {
      validators: (group: AbstractControl): ValidationErrors | null => {
        let pass = group.get('password').value;
        let confirmPass = group.get('confirmPassword').value;

        return pass === confirmPass ? null : { notSame: true };
      } // Warning! At this point, we defined the 'notSame' error property at the form level, not at the confirmPassword element level!
    });
  }

  // Property (get) - usage: using without parenthesis as in C#/Java
  get component() {
    return this.form.controls;
  }

  submitted: boolean = false;

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid)
      return;

    const password = this.form.value.password
    const confirmPassword = this.form.value.confirmPassword

    this.activatedRoute.params.subscribe({
      next: async params => {
        const userId: string = params["userId"];
        const resetToken: string = params["resetToken"];
        const result = await this.userService.updatePassword(userId, resetToken, password, confirmPassword, () => {
          this.toastrService.message("", "Password Update Successful", {
            messageType: ToastrMessageType.Success,
            position: ToastrPosition.TopRight
          });
          this.hideSpinner(SpinnerType.BallAtom);
          this.router.navigate(['login']);
        }, error => {
          this.toastrService.message(error.message, "Password Update Failed", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          this.hideSpinner(SpinnerType.BallAtom);
        });
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    controlName = controlName.charAt(0).toUpperCase() + controlName.slice(1);

    if (control?.hasError('required')) {
      if (controlName == 'ConfirmPassword')
        return 'Password confirmation is required.';
      return `${controlName} is required.`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.minlength?.requiredLength;
      return `${controlName} must be at least ${minLength} characters.`;
    }
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.maxlength?.requiredLength;
      return `${controlName} must be no more than ${maxLength} characters.`;
    }
    if (control?.hasError('pattern')) {
      if (controlName == 'Password')
        return `• At least one special character.
      • At least one uppercase letter.
      • At least one lowercase letter.
      • No spaces allowed.
      • Minimum 8 characters, maximum 30 characters.`;
    }
    if (this.form.hasError('notSame')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  passwordVisible = false;
  confirmPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
}
