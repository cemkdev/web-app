import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { IdentityCheck } from '../../../contracts/auth/identity_check';
import { SilentRefreshService } from '../silent-refresh.service';
import { Router } from '@angular/router';
import { _isAuthenticated, AuthService } from '../auth.service';
import { Log_Out_Response } from '../../../contracts/auth/log_out';
import { AuthorizationEndpointService } from './authorization-endpoint.service';
import { HttpHeaders } from '@angular/common/http';
import { ElementAccessControlService } from '../element-access-control.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private _isAdmin: boolean;
  private _username: string;
  private _userId: string;
  private isAdminSubject = new BehaviorSubject<boolean>(null);
  private _accessibleMenus: string[] = [];

  // GET-SET Sidebar Menu Items Info
  get accessibleMenus(): string[] {
    return this._accessibleMenus;
  }
  setAccessibleMenus(menus: string[]) {
    this._accessibleMenus = menus;
  }

  // GET-SET isAdmin Info - USED BY INTERCEPTOR
  get isAdmin$(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }
  setIsAdmin$(value: boolean) {
    this.isAdminSubject.next(value);
  }

  // GET-SET userId - USED BY whole app
  get isAdmin(): boolean {
    return this._isAdmin;
  }
  setIsAdmin(value: boolean) {
    this._isAdmin = value;
  }

  // GET-SET userId
  get userId(): string {
    return this._userId;
  }
  setUserId(value: string) {
    this._userId = value;
  }

  // GET-SET username
  get username(): string {
    return this._username;
  }
  setUsername(value: string) {
    this._username = value;
  }

  constructor(
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService,
    private silentRefreshService: SilentRefreshService,
    private router: Router,
    public authService: AuthService,
    private socialAuthService: SocialAuthService,
    private authorizationEndpointService: AuthorizationEndpointService,
    private elementAccessControlService: ElementAccessControlService
  ) {
    this.silentRefreshService.refreshNeeded$.subscribe(() => {
      this.refreshTokenLogin();
    });
    authService.identityCheck();
  }

  // Called by APP_INITIALIZER to fetch authorization-required sidebar menu items.
  async preloadAccessibleMenus(): Promise<void> {
    const menus = await this.authorizationEndpointService.fetchAccessibleMenus();
    this.setAccessibleMenus(menus);
  }

  // Internal Login
  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { usernameOrEmail, password });

    await firstValueFrom(observable);

    await this.identityCheck(async state => {
      if (state.isAuthenticated) {
        if (state.isAdmin) {
          await this.preloadAccessibleMenus();
          await this.elementAccessControlService.preloadPermissions(this.userId);
        }
        this.toastrService.message("You have successfully logged in.", "Welcome Back!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });

        if (state.expiration)
          localStorage.setItem("accessTokenExpiration", state.expiration.toString());
        if (state.refreshBeforeTime)
          localStorage.setItem("refreshBeforeTime", state.refreshBeforeTime.toString());

        const remainingTime = new Date(state.expiration).getTime() - Date.now();
        const refreshBeforeMs = parseInt(state.refreshBeforeTime) * 1000;

        if (remainingTime > refreshBeforeMs) {
          this.silentRefreshService.start();
        } else {
          setTimeout(() => {
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
          }, remainingTime);
        }
      } else {
        this.toastrService.message("Login failed due to invalid token.", "Login Failed!", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
      callBackFunction?.();
    });
  }

  // Instant Identity Check
  async identityCheck(callBackFunction?: (state) => void): Promise<void> {
    try {
      const observable: Observable<IdentityCheck> = this.httpClientService.get({
        controller: "auth",
        action: "identity-check",
        headers: new HttpHeaders({
          'X-Skip-Error-Handler': 'true'
        })
      });

      const result = await firstValueFrom(observable);
      this.setIsAdmin$(result.isAdmin);
      this.setIsAdmin(result.isAdmin);
      this.setUserId(result.userId);
      this.setUsername(result.username);

      callBackFunction?.(result);
    } catch (error) {
      const failedState: IdentityCheck = {
        userId: null,
        isAuthenticated: false,
        username: null,
        expiration: null,
        refreshBeforeTime: null,
        isAdmin: null
      };

      this.setUsername(null);
      this.setIsAdmin(null);
      this.setAccessibleMenus([]);
      this.elementAccessControlService.clearPermissions();

      localStorage.removeItem("accessTokenExpiration");

      callBackFunction?.(failedState);
    }
  }

  // Used by Resolver
  identityCheck$(): Observable<IdentityCheck> {
    return this.httpClientService.get<IdentityCheck>({
      controller: "auth",
      action: "identity-check"
    });
  }

  checkPageAccess(url: string): Observable<any> {
    return this.httpClientService.get({
      controller: 'authorization',
      action: 'check-access',
      queryString: `url=${encodeURIComponent(url)}`
    });
  }

  // Refresh Token
  async refreshTokenLogin(callBackFunction?: (state) => void): Promise<any> {
    try {
      const observable: Observable<any> = this.httpClientService.post({
        controller: "auth",
        action: "refresh-token-login",
        withCredentials: true
      }, {});

      await firstValueFrom(observable);

      await this.identityCheck(state => {
        if (state.isAuthenticated) {
          if (state.expiration)
            localStorage.setItem("accessTokenExpiration", state.expiration.toString());

          const remainingTime = new Date(state.expiration).getTime() - Date.now();
          const refreshBeforeMs = parseInt(state.refreshBeforeTime) * 1000;

          if (remainingTime > refreshBeforeMs) {
            this.silentRefreshService.start();
          } else {
            console.warn("Silent refresh skipped, last token in use.");

            setTimeout(() => {
              this.logout(() => {
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
              });
            }, remainingTime);
          }

          callBackFunction?.(true);
        } else {
          this.toastrService.message("Session refresh failed.", "Refresh Error", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopLeft
          });

          callBackFunction?.(false);
        }
      });
    } catch (error) {
      this.logout(() => {
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
      });

      callBackFunction?.(false);
    }
  }

  // External Login - Google
  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "google-login"
    }, user);

    await firstValueFrom(observable);

    await this.identityCheck(async state => {
      if (state.isAuthenticated) {
        if (state.isAdmin) {
          await this.preloadAccessibleMenus();
          await this.elementAccessControlService.preloadPermissions(this.userId);
        }
        this.toastrService.message("Google login has been successful.", "Successfully Logged In!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight
        });

        if (state.expiration)
          localStorage.setItem("accessTokenExpiration", state.expiration.toString());
        if (state.refreshBeforeTime)
          localStorage.setItem("refreshBeforeTime", state.refreshBeforeTime.toString());

        const remainingTime = new Date(state.expiration).getTime() - Date.now();
        const refreshBeforeMs = parseInt(state.refreshBeforeTime) * 1000;

        if (remainingTime > refreshBeforeMs) {
          this.silentRefreshService.start();
        } else {
          setTimeout(() => this.logout(), remainingTime);
        }

      } else {
        this.toastrService.message("Google login failed.", "Login Error", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight
        });
      }
      callBackFunction?.();
    });
  }

  // External Login - Facebook
  async facebookLogin(user: SocialUser, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "facebook-login"
    }, user);

    await firstValueFrom(observable);

    await this.identityCheck(async state => {
      if (state.isAuthenticated) {
        if (state.isAdmin) {
          await this.preloadAccessibleMenus();
          await this.elementAccessControlService.preloadPermissions(this.userId);
        }
        this.toastrService.message("Facebook login has been successful.", "Successfully Logged In!", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight
        });

        if (state.expiration)
          localStorage.setItem("accessTokenExpiration", state.expiration.toString());
        if (state.refreshBeforeTime)
          localStorage.setItem("refreshBeforeTime", state.refreshBeforeTime.toString());

        const remainingTime = new Date(state.expiration).getTime() - Date.now();
        const refreshBeforeMs = parseInt(state.refreshBeforeTime) * 1000;

        if (remainingTime > refreshBeforeMs) {
          this.silentRefreshService.start();
        } else {
          setTimeout(() => this.logout(), remainingTime);
        }

      } else {
        this.toastrService.message("Facebook login failed.", "Login Error", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight
        });
      }
      callBackFunction?.();
    });
  }

  // Logout
  logout(callback?: (response?: Log_Out_Response) => void): Promise<void> {
    const observable = this.httpClientService.post<Log_Out_Response>({
      controller: 'auth',
      action: 'logout',
      withCredentials: true
    }, {});

    return firstValueFrom(observable)
      .then(async response => {
        this.silentRefreshService.stop();
        localStorage.removeItem("accessTokenExpiration");

        try {
          await this.socialAuthService.signOut();
        } catch (error) {
          if (error !== "Not logged in" && !(error && error.message === "Not logged in")) {
            throw error;
          }
        }

        this.setUsername(null);
        this.setIsAdmin(null);
        this.setAccessibleMenus([]);
        await this.elementAccessControlService.clearPermissions();

        this.authService.identityCheck();
        callback?.(response);
      })
      .catch(async error => {
        console.error("Logout failed:", error);

        try {
          await this.socialAuthService.signOut();
        } catch (error) {
          if (error !== "Not logged in" && !(error && error.message === "Not logged in")) {
            throw error;
          }
        }

        this.setUsername(null);
        this.setIsAdmin(null);
        this.setAccessibleMenus([]);

        callback?.();
      });
  }

  // Password Reset Request
  async passwordReset(email: string, callBackFunction?: () => void) {

    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "password-reset"
    }, email);

    await firstValueFrom(observable);
    callBackFunction();
  }

  // Verify Reset Token
  async verifyResetToken(resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> {
    const observable: Observable<any> = this.httpClientService.post({
      controller: "auth",
      action: "verify-reset-token"
    }, {
      resetToken: resetToken,
      userId: userId
    });

    const state = await firstValueFrom(observable);
    callBackFunction();
    return state?.state === true;
  }
}
