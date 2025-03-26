import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';

export const authGuard: CanActivateFn = (route, state) => {

  const jwtHelper: JwtHelperService = inject(JwtHelperService);
  const router: Router = inject(Router);
  const toastrService: CustomToastrService = inject(CustomToastrService);
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);

  spinner.show(SpinnerType.BallAtom);

  const token: string = localStorage.getItem("accessToken");

  //const decodeToken = jwtHelper.decodeToken(token);
  //const expirationDate: Date = jwtHelper.getTokenExpirationDate(token);
  let expired: boolean;

  try {
    expired = jwtHelper.isTokenExpired(token);
  } catch (error) {
    expired = true;
  }

  // => "!{variable}"" (JS) => "{variable} == null" (C#/Java)
  if (!token || expired) {
    router.navigate(["login"], { queryParams: { returnUrl: state.url } });

    toastrService.message("Please log in to continue.", "Unauthorized Access!", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    });
  }

  spinner.hide(SpinnerType.BallAtom);
  return true;
};
