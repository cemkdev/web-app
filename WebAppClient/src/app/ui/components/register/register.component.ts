import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseComponent implements OnInit {

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService
  ) {
    super(spinner);
  }

  phoneNumberTyped = false;
  phoneNumber = "";
  onPhoneNumberFocus() {
    this.phoneNumberTyped = true;
  }
  onPhoneNumberBlur(event: any) {
    const value = this.form.get('phoneNumber')?.value;
    this.phoneNumberTyped = false;
    if (!value) {
      this.phoneNumberTyped = false;
      this.form.get('phoneNumber')?.setValue('');
    }
  }

  goBack() {
    this.location.back();
  }

  form: FormGroup; // Represents form itself in html.

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      firstName: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      lastName: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      username: ["", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ]],
      email: ["", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phoneNumber: ["", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern(/^\d{10}$/)
      ]],
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

  async onSubmit(user: User) {
    this.submitted = true;

    if (this.form.invalid)
      return;

    const result: Create_User = await this.userService.create(user, () => this.showSpinner(SpinnerType.BallAtom));

    if (result.succeeded) {
      this.toastrService.message(result.message, "User Registration Successful", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
      this.hideSpinner(SpinnerType.BallAtom);
    }
    else {
      this.toastrService.message(result.message, "User Registration Failed", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
      this.hideSpinner(SpinnerType.BallAtom);
    }
  }

  getErrorMessage(controlName: string): string {
    const control = this.form.get(controlName);
    controlName = controlName.charAt(0).toUpperCase() + controlName.slice(1);

    if (controlName == 'FirstName')
      controlName = 'First Name';
    if (controlName == 'LastName')
      controlName = 'Last Name';
    if (controlName == 'PhoneNumber')
      controlName = 'Phone number';

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

      if (controlName == 'Email')
        return 'Please enter a valid email address.';

      if (controlName == 'Phone number')
        return 'Please enter a valid phone number address.';
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
