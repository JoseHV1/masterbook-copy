import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs';
import { PAYMENT_STATUS } from '../enums/payment-status';
import { Location } from '@angular/common';
import { UiService } from '../services/ui.service';
import { NavigationService } from '../services/navigation.service';
import { TranslateService } from '@ngx-translate/core';

export const PaymentGuard: CanActivateFn = () => {
  const _authService = inject(AuthService);
  const location = inject(Location);
  const navigation = inject(NavigationService);
  const ui = inject(UiService);
  const t = inject(TranslateService);

  return _authService.auth$.pipe(
    take(1),
    map(auth => auth?.user.agency?.payment_status === PAYMENT_STATUS.PAYED),
    tap(resp => {
      if (!resp) {
        ui.showAlertError(t.instant('SHARED.PAGES_LAYOUT.TOOLTIP_PAYMENT_PENDING'));
        if (!navigation.wasNavigationInternal()) location.back();
      }
    })
  );
};
