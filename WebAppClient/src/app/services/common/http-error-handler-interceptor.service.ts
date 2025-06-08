import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, filter, from, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { UserAuthService } from './models/user-auth.service';
import { NavigationExtras, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(
    private toastrService: CustomToastrService,
    private spinner: NgxSpinnerService,
    private userAuthService: UserAuthService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skipErrorHandler = req.headers?.has('X-Skip-Error-Handler');

    return next.handle(req).pipe(catchError(error => {
      const url = this.router.url;

      switch (error.status) {
        case HttpStatusCode.Unauthorized:
          // if (skipErrorHandler) return throwError(() => error); // APP_INITIALIZER'dan geliyorsa sessizce geç.
          if (skipErrorHandler) return EMPTY; // APP_INITIALIZER'dan geliyorsa DAHA DA sessizce geç.
          if (url == "/products")
            this.toastrService.message("Please log in to add items to your cart.", "Int: Please Log In!", {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.TopRight
            });
          else {
            this.toastrService.message("You are not authorized to perform this action!", "Int: Unauthorized Action!", {
              messageType: ToastrMessageType.Warning,
              position: ToastrPosition.BottomFullWidth
            });
            this.userAuthService.logout(() => {
              const forbiddenPaths = ['/admin'];
              const isForbidden = forbiddenPaths.some(path => url.startsWith(path));
              if (isForbidden) {
                this.router.navigate(['/login'], {
                  queryParams: { returnUrl: url }
                });
              } else {
                this.router.navigate([url]);
              }
            });
          }
          break;

        case HttpStatusCode.Forbidden:

          return this.userAuthService.isAdmin$
            .pipe(
              filter(val => val !== null),
              take(1),
              switchMap(isAdmin => {
                const adminOnly = error?.headers?.get("X-Admin-Only") === 'true';

                if (adminOnly && !isAdmin) {
                  this.router.navigate(["/"]);
                } else if (adminOnly && isAdmin) {
                  this.router.navigate(["/admin"]);
                } else {
                  this.router.navigate(["/"]);
                }

                this.toastrService.message("You are not authorized to view this page.", "Int: Unauthorized Action!", {
                  messageType: ToastrMessageType.Warning,
                  position: ToastrPosition.BottomFullWidth
                });

                this.spinner.hide(SpinnerType.BallAtom);
                return throwError(() => error);
              })
            );

        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Cannot access the server.", "Int: Server Error!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.BadRequest:
          this.toastrService.message("An invalid request was made.", "Int: Invalid Request!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        case HttpStatusCode.NotFound:
          this.toastrService.message("Page not found!", "Int: Page not found!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
        default:
          this.toastrService.message("An unexpected error occurred.", "Int: Error!", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.BottomFullWidth
          });
          break;
      }

      this.spinner.hide(SpinnerType.BallAtom);
      return of(error);
    }));
  }
}
