import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, tap } from 'rxjs';
import { PAYMENT_STATUS } from '../enums/payment-status';
import { Location } from '@angular/common';
import { UiService } from '../services/ui.service';
import { NavigationService } from '../services/navigation.service';

export const PaymentGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const location = inject(Location);
  const navigation = inject(NavigationService);
  const ui = inject(UiService);

  return _authService.auth$.pipe(
    map(auth => auth?.user.agency?.payment_status === PAYMENT_STATUS.PAYED),
    tap(resp => {
      if (!resp) {
        ui.showAlertError(
          'You cannot perform this action because your agency has a pending payment. Please contact your administrator.'
        );
        if (!navigation.wasNavigationInternal()) location.back();
      }
    })
  );
};
