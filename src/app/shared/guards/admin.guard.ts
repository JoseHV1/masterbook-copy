import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';
import { RolesEnum } from '../enums/roles.enum';

export const AdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    map(auth => !!(auth?.user.role === RolesEnum.ADMIN)),
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['portal']);
      }
    })
  );
};
