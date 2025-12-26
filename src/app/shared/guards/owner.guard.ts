import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';
import { RolesEnum } from '../enums/roles.enum';

export const OwnerGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    map(
      auth =>
        !!(
          auth?.user.role === RolesEnum.ADMIN ||
          auth?.user.role === RolesEnum.AGENCY_OWNER ||
          auth?.user.role === RolesEnum.AGENCY_ADMINISTRATOR
        )
    ),
    tap(isAdmin => {
      if (!isAdmin) {
        router.navigate(['/unauthorized']); // Navigate to an unauthorized page or another appropriate page
      }
    })
  );
};
