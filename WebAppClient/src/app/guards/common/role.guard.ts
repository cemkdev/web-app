import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../../services/common/models/user-auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { SuperUser } from '../../constants/super-user';
import { AuthorizationEndpointService } from '../../services/common/models/authorization-endpoint.service';

export const roleGuard: CanActivateFn = async (route, state) => {
  const userAuthService = inject(UserAuthService);
  const authorizationEndpointService = inject(AuthorizationEndpointService);
  const router = inject(Router);
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);
  const toastrService: CustomToastrService = inject(CustomToastrService);

  spinner.show(SpinnerType.BallAtom);

  const url = state.url;
  const menuName = route.data?.['menuName'] as string;

  try {
    let isAdmin: boolean = null;
    let username: string;

    await userAuthService.identityCheck(result => {
      isAdmin = result?.isAdmin;
      username = result?.username
    });

    if (username == SuperUser.username) {
      spinner.hide(SpinnerType.BallAtom);
      return true;
    }

    // Admin Paneline mi gidilmek isteniyor kontrolü
    if (url.startsWith('/admin')) {
      // Admin paneli ise 'admin' yetkisi var mı kontrolü
      if (!isAdmin) {
        spinner.hide(SpinnerType.BallAtom);
        toastrService.message("You are not authorized to view this page2.", "Unauthorized Access!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        });
        return router.parseUrl('/');
      }

      // Özel sayfa adı tanımlanmamış. Muhtemelen sayfa boş... (Admin Panel tarafı)
      if (!menuName) {
        spinner.hide(SpinnerType.BallAtom);
        return true; // Örn. dashboard, custormers gibi sayfalar.
      }

      // Admin Panel endpoint-role ilişkisi yetki kontrolü
      const hasAccess = await authorizationEndpointService.hasAccessToMenu(menuName);
      if (hasAccess) {
        spinner.hide(SpinnerType.BallAtom);
        return true;
      }
      else {
        spinner.hide(SpinnerType.BallAtom);
        toastrService.message("You are not authorized to view this page3.", "Unauthorized Access!", {
          messageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight
        });
        return router.parseUrl('/admin');
      }
    }

    // Özel sayfa adı tanımlanmamış. Muhtemelen sayfa boş... (UI tarafı)
    if (!menuName) {
      spinner.hide(SpinnerType.BallAtom);
      return true;
    }

    // Admin Paneli dışındaki(ui tarafı) endpoint-role ilişkisi yetki kontrolü
    const hasAccess = await authorizationEndpointService.hasAccessToMenu(menuName);
    if (hasAccess) {
      spinner.hide(SpinnerType.BallAtom);
      return true;
    } else {
      spinner.hide(SpinnerType.BallAtom);
      toastrService.message("You are not authorized to view this page.", "Unauthorized Access!", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopRight
      });
      return router.parseUrl('/');
    }
  } catch (err) {
    console.error("RoleGuard error:", err);
    spinner.hide(SpinnerType.BallAtom);
    return router.parseUrl('/');
  }
};
