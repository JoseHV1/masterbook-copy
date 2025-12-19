import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolesEnum } from '../enums/roles.enum';
import {
  brokerRolesDataset,
  welcomeRolesAgencyDataset,
  welcomeRolesDataset,
} from '../datatsets/roles.datasets';

export const AgentGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const auth = authService.getAuth();
  const role = auth?.user.role as RolesEnum | undefined;

  // if not logged in, let AuthGuard handle it, but be defensive:
  if (!auth) {
    return router.createUrlTree(['']);
  }

  const isBroker = role ? brokerRolesDataset.includes(role) : false;
  const hasAcceptedTerms = !!auth.user.accepted_terms_conditions_at;
  const isWelcomeRole = role ? welcomeRolesDataset.includes(role) : false;
  const isWelcomeAgencyRole = role
    ? welcomeRolesAgencyDataset.includes(role)
    : false;

  // terms not accepted → send to proper welcome page
  if (!hasAcceptedTerms && isWelcomeRole) {
    const targetRoute = isBroker ? 'welcome' : 'welcome-insured';
    return router.createUrlTree([targetRoute]);
  }

  if (!hasAcceptedTerms && isWelcomeAgencyRole) {
    return router.createUrlTree(['welcome-agency-broker-admin']);
  }

  // not broker → send to client portal
  if (!isBroker) {
    return router.createUrlTree(['portal-client']);
  }

  // broker with terms accepted → ok
  return true;
};
