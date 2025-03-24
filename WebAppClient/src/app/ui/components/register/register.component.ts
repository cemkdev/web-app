import { Component, inject, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ThemeService } from '../../../services/theme.service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User } from '../../../entities/user';
import { UserService } from '../../../services/common/models/user.service';
import { Create_User } from '../../../contracts/users/create_user';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  //readonly themeService = inject(ThemeService);

  goBack() {
    this.location.back();
  }

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService
  ) { }

  form: FormGroup; // Represents form itself in html.

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ["", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25)
      ]],
      surname: ["", [
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
      password: ["", [
        Validators.required,
        //Validators.minLength(8),
        //Validators.maxLength(30),
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

    const result: Create_User = await this.userService.create(user);

    if (result.succeeded)
      this.toastrService.message(result.message, "User Registration Successful", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      });
    else
      this.toastrService.message(result.message, "User Registration Failed", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
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

      if (controlName == 'Email')
        return 'Please enter a valid email address.';
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
