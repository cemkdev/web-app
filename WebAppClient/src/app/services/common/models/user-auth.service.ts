import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { firstValueFrom, Observable } from 'rxjs';
import { TokenResponse } from '../../../contracts/token/tokenResponse';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { IdentityCheck } from '../../../contracts/auth/identity_check';
import { SilentRefreshService } from '../silent-refresh.service';
import { Router } from '@angular/router';
import { _isAuthenticated, AuthService } from '../auth.service';
import { Log_Out_Response } from '../../../contracts/auth/log_out';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService,
    private silentRefreshService: SilentRefreshService,
    private router: Router,
    public authService: AuthService,
    private socialAuthService: SocialAuthService
  ) {
    this.silentRefreshService.refreshNeeded$.subscribe(() => {
      this.refreshTokenLogin();
    });
    authService.identityCheck();
  }

  // Internal Login
  async login(usernameOrEmail: string, password: string, callBackFunction?: () => void): Promise<any> {
    const observable: Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse>({
      controller: "auth",
      action: "login"
    }, { usernameOrEmail, password });

    await firstValueFrom(observable);

    await this.identityCheck(state => {
      if (state.isAuthenticated) {
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
        action: "identity-check"
      });

      const result = await firstValueFrom(observable);

      callBackFunction?.(result);
    } catch (error) {
      const failedState: IdentityCheck = {
        isAuthenticated: false,
        username: null,
        expiration: null,
        refreshBeforeTime: null
      };

      localStorage.removeItem("accessTokenExpiration");

      callBackFunction?.(failedState);
    }
  }

  // Refresh Token
  async refreshTokenLogin(callBackFunction?: (state) => void): Promise<any> {
    try {
      const observable: Observable<any> = this.httpClientService.post({
        controller: "auth",
        action: "refreshTokenLogin",
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

    await this.identityCheck(state => {
      if (state.isAuthenticated) {
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

    await this.identityCheck(state => {
      if (state.isAuthenticated) {
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
