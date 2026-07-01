import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';
import { RolesEnum } from '../enums/roles.enum';

export const AdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    take(1),
    map(auth => !!(auth?.user.role === RolesEnum.ADMIN)),
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['portal']);
      }
    })
  );
};
