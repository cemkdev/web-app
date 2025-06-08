import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ThemeService } from './services/theme.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from './services/ui/custom-toastr.service';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';
import { BaseComponent, SpinnerType } from './base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ComponentName, DynamicLoadComponentService } from './services/common/dynamic-load-component.service';
import { DynamicLoadComponentDirective } from './directives/common/dynamic-load-component.directive';
import { UserAuthService } from './services/common/models/user-auth.service';
import { SilentRefreshService } from './services/common/silent-refresh.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent extends BaseComponent {
  @ViewChild(DynamicLoadComponentDirective, { static: true })
  dynamicLoadComponentDirective: DynamicLoadComponentDirective;

  readonly themeService = inject(ThemeService);

  isRegisterPage: boolean = false;
  isLoginPage: boolean = false;
  isPassResetPage: boolean = false;
  isPassUpdatePage: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    public userAuthService: UserAuthService,
    spinner: NgxSpinnerService,
    private toastrService: CustomToastrService,
    private dynamicLoadComponentService: DynamicLoadComponentService,
    private silentRefreshService: SilentRefreshService
  ) {
    super(spinner);
    authService.identityCheck();
    silentRefreshService.start();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRegisterPage = event.url.includes('register');
        this.isLoginPage = event.url.includes('login');
        this.isPassResetPage = event.url.includes('/password-reset');
        this.isPassUpdatePage = event.url.includes('/password-update');
      } // Don't forget to add these 'is[Page]' variables to navbar tag as *ngIf parameter!
    });
  }

  logOut() {
    this.showSpinner(SpinnerType.BallAtom);

    this.userAuthService.logout((res) => {

      const url = this.router.url;
      const forbiddenPaths = ['/admin'];
      const isForbidden = forbiddenPaths.some(path => url.startsWith(path));
      if (isForbidden) {
        this.router.navigate(['/login'], {
          queryParams: { returnUrl: url }
        });
      }
      else
        this.router.navigate([url]);

      this.hideSpinner(SpinnerType.BallAtom);

      this.toastrService.message(
        "Session closed.",
        res?.message || "Logged Out",
        {
          messageType: ToastrMessageType.Info,
          position: ToastrPosition.TopRight
        }
      );
    });
  }

  loadComponent() {
    this.dynamicLoadComponentService.loadComponent(ComponentName.BasketsComponent, this.dynamicLoadComponentDirective.viewContainerRef);
  }
}
