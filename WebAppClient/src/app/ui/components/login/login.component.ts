import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserLogin } from '../../../entities/user-login';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit, AfterViewInit {

  user: Promise<SocialUser>;

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
  }
  ngAfterViewInit(): void {
    // Keep the Google button ready...
    const googleSigninCustomButton = document.getElementById('google-signin-custom-btn') as HTMLElement;
    googleSigninCustomButton.click();
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

        if (returnUrl != null)
          this.router.navigate([returnUrl]);
        else
          this.router.navigate(["home"]);
      });
      this.hideSpinner(SpinnerType.BallAtom);
    });
  }

  // Google Login
  handleGoogleLogin() {
    this.user = this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(async (user) => {
      if (user) {
        this.showSpinner(SpinnerType.BallAtom);

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
      }
    });
  }

  // Facebook Login
  facebookLogin() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      this.showSpinner(SpinnerType.BallAtom);

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
    });
  }
}
