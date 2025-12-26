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

export const InsuredGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    map(auth => auth?.user.role === RolesEnum.INSURED),
    tap(resp => {
      const auth = _authService.getAuth();
      const hasAcceptedTerms = !!auth?.user.accepted_terms_conditions_at;

      const isWelcomeAgencyRole = welcomeRolesAgencyDataset.includes(
        auth?.user.role as RolesEnum
      );

      let targetRoute = '';

      if (!hasAcceptedTerms && isWelcomeAgencyRole) {
        router.navigate(['welcome-agency-broker-admin']);
      } else if (!hasAcceptedTerms) {
        targetRoute = resp ? 'welcome-insured' : 'welcome';
        router.navigate([targetRoute]);
      } else if (!resp) {
        router.navigate(['portal']);
      }
    })
  );
};
