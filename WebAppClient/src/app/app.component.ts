import { Component, inject, ViewEncapsulation } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';
import { BaseComponent, SpinnerType } from './base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent extends BaseComponent {
  readonly themeService = inject(ThemeService);

  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    spinner: NgxSpinnerService,
    private toastrService: CustomToastrService,
    private activatedRoute: ActivatedRoute
  ) {
    super(spinner);
    authService.identityCheck();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterPage = event.url.includes('register');
        this.isLoginPage = event.url.includes('login');
      }
    });
  }

  logOut() {
    this.showSpinner(SpinnerType.BallAtom);

    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""]);

    this.hideSpinner(SpinnerType.BallAtom);

    this.toastrService.message("Session closed.", "Logged Out", {
      messageType: ToastrMessageType.Info,
      position: ToastrPosition.TopRight
    });
  }
}
