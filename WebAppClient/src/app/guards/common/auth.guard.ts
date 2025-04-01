import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { _isAuthenticated, AuthService } from '../../services/common/auth.service';

export const authGuard: CanActivateFn = (route, state) => {

  const router: Router = inject(Router);
  const toastrService: CustomToastrService = inject(CustomToastrService);
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);
  const authService: AuthService = inject(AuthService);

  spinner.show(SpinnerType.BallAtom);

  authService.identityCheck();

  // => "!{variable}"" (JS) => "{variable} == null" (C#/Java)
  if (!_isAuthenticated) {
    router.navigate(["login"], { queryParams: { returnUrl: state.url } });

    toastrService.message("Please log in to continue.", "Unauthorized Access!", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopRight
    });
  }

  spinner.hide(SpinnerType.BallAtom);
  return true;
};
