import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import { RouterModule, Routes } from '@angular/router';
import { InternalLayoutModule } from '../shared/layouts/internal-layout/internal-layout.module';

const defaultRoute = 'dashboard';
const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(
            module => module.ReportsModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar/calendar.module').then(
            module => module.CalendarModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./activities/activities.module').then(
            module => module.ActivitiesModule
          ),
      },
      {
        path: 'accounts',
        loadChildren: () =>
          import('./accounts/accounts.module').then(
            module => module.AccountsModule
          ),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import('./claims/claims.module').then(module => module.ClaimsModule),
      },
      {
        path: 'requests',
        loadChildren: () =>
          import('./requests/requests.module').then(
            module => module.RequestsModule
          ),
      },
      {
        path: 'agency',
        loadChildren: () =>
          import('./agency/agency.module').then(module => module.AgencyModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then(module => module.UsersModule),
      },
      {
        path: 'request-forms',
        loadChildren: () =>
          import('./forms/forms.module').then(module => module.FormsModule),
      },
      {
        path: 'insurer',
        loadChildren: () =>
          import('./insurer/insurer.module').then(
            module => module.InsurerModule
          ),
      },
      {
        path: 'risk',
        loadChildren: () =>
          import('./risk/risk.module').then(module => module.RiskModule),
      },
      {
        path: 'policies',
        loadChildren: () =>
          import('./policies/policies.module').then(
            module => module.PoliciesModule
          ),
      },
      {
        path: 'commissions',
        loadChildren: () =>
          import('./financials/commissions/commissions.module').then(
            module => module.CommissionsModule
          ),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('./financials/invoices/invoice.module').then(
            module => module.InvoiceModule
          ),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./financials/payments/payments.module').then(
            module => module.PaymentsModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(
            module => module.ProfileModule
          ),
      },
      {
        path: 'email',
        loadChildren: () =>
          import('./communication/communication.module').then(
            module => module.CommunicationModule
          ),
      },
      {
        path: 'agency-settings',
        loadChildren: () =>
          import('./agency-settings/agency-settings.module').then(
            module => module.AgencySettingsModule
          ),
      },
      {
        path: 'invite',
        loadChildren: () =>
          import('./invite-policy-holder/invite-policy-holder.module').then(
            module => module.InvitePolicyHolderModule
          ),
      },
      {
        path: 'purchase-complete',
        loadChildren: () =>
          import('./payment-success/payment-success.module').then(
            module => module.PaymentSuccessModule
          ),
      },
      {
        path: 'payment-failed',
        loadChildren: () =>
          import('./payment-error/payment-error.module').then(
            module => module.PaymentErrorModule
          ),
      },
      { path: '', redirectTo: defaultRoute, pathMatch: 'full' },
      { path: '**', redirectTo: defaultRoute, pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: defaultRoute, pathMatch: 'full' },
  { path: '**', redirectTo: defaultRoute, pathMatch: 'full' },
];

@NgModule({
  declarations: [PortalComponent],
  imports: [CommonModule, InternalLayoutModule, RouterModule.forChild(routes)],
})
export class PortalModule {}
