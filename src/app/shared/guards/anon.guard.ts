import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';

export const AnonGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const router = inject(Router);

  return _authService.auth$.pipe(
    map(auth => auth === null),
    tap(resp => {
      if (!resp) {
        router.navigate(['portal']);
      }
    })
  );
};
