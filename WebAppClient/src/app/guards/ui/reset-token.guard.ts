import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { UserAuthService } from '../../services/common/models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';

export const resetTokenGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean | UrlTree> => {

  const userAuthService = inject(UserAuthService);
  const router = inject(Router);
  const spinnerService = inject(NgxSpinnerService);

  const userId = route.paramMap.get('userId');
  const resetToken = route.paramMap.get('resetToken');

  if (!userId || !resetToken) {
    return router.createUrlTree(['/invalid']);
  }

  spinnerService.show(SpinnerType.BallAtom);

  try {
    const isValid = await userAuthService.verifyResetToken(resetToken, userId, () => {
      spinnerService.hide(SpinnerType.BallAtom);
    });

    if (isValid)
      return true;
    else
      return router.createUrlTree(['/invalid']);
  } catch (error) {
    spinnerService.hide(SpinnerType.BallAtom);
    return router.createUrlTree(['/invalid']);
  }
};
