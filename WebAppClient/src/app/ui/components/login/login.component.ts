import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserLogin } from '../../../entities/user-login';
import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(
    private location: Location,
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
  }

  goBack() {
    this.location.back();
  }

  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      usernameOrEmail: [""],
      password: [""]
    });

    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.BallAtom);
      switch (user.provider) {
        case "GOOGLE":
          await this.userAuthService.googleLogin(user, () => {
            this.authService.identityCheck();
            this.activatedRoute.queryParams.subscribe(params => {
              const returnUrl: string = params["returnUrl"];
              if (returnUrl)
                this.router.navigate([returnUrl]);
              else
                this.goBack();
            });
            this.hideSpinner(SpinnerType.BallAtom);
          });
          break;
        case "FACEBOOK":
          await this.userAuthService.facebookLogin(user, () => {
            this.authService.identityCheck();
            this.activatedRoute.queryParams.subscribe(params => {
              const returnUrl: string = params["returnUrl"];
              if (returnUrl)
                this.router.navigate([returnUrl]);
              else
                this.goBack();
            });
            this.hideSpinner(SpinnerType.BallAtom);
          });
          break;
      }
    });
  }

  passwordVisible = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit(user: UserLogin) {
    this.showSpinner(SpinnerType.BallAtom);

    await this.userAuthService.login(user.usernameOrEmail, user.password, () => {
      this.authService.identityCheck();

      this.activatedRoute.queryParams.subscribe(params => {
        const returnUrl: string = params["returnUrl"];
        if (returnUrl)
          this.router.navigate([returnUrl]);
        else
          this.goBack();
      });

      this.hideSpinner(SpinnerType.BallAtom);
    });
  }

  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

}
