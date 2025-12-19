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
import { welcomeRolesAgencyDataset } from '../datatsets/roles.datasets';

export const WelcomeAgencyBrokerAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    map(
      auth =>
        welcomeRolesAgencyDataset.includes(auth?.user.role as RolesEnum) &&
        !auth?.user.accepted_terms_conditions_at
    ),
    tap(resp => {
      if (!resp) {
        router.navigate(['portal']);
      }
    })
  );
};
