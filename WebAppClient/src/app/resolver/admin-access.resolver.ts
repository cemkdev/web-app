import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { UserAuthService } from '../services/common/models/user-auth.service';
import { catchError, map, of } from 'rxjs';
import { SuperUser } from '../constants/super-user';

export const adminAccessResolver: ResolveFn<boolean> = (route, state) => {
  const authService = inject(UserAuthService);
  const router = inject(Router);

  return authService.identityCheck$().pipe(
    map(identity => {
      if (identity.username == SuperUser.username)
        return true;

      if (identity?.isAuthenticated && identity?.isAdmin) {
        return true;
      } else {
        router.navigate(['/']);
        return false;
      }
    }),
    catchError((error) => {
      if (error.status === 401 || error.status === 500) {
        router.navigate(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      } else {
        router.navigate(['/']);
      }
      return of(false);
    })
  );
};
