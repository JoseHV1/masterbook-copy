import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalAdminComponent } from './portal-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { InternalLayoutModule } from '../shared/layouts/internal-layout/internal-layout.module';

const routes: Routes = [
  {
    path: '',
    component: PortalAdminComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            module => module.DashboardModule
          ),
      },
      {
        path: 'leads',
        loadChildren: () =>
          import('./leads/leads.module').then(module => module.AdminLeadsModule),
      },
      {
        path: 'agencies',
        loadChildren: () =>
          import('./agency/agency.module').then(module => module.AgencyModule),
      },
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
          import('../portal/calendar/calendar.module').then(
            module => module.CalendarModule
          ),
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('../portal/communication/communication.module').then(
            module => module.CommunicationModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then(
            module => module.AdminProfileModule
          ),
      },
      {
        path: 'how-to',
        loadChildren: () =>
          import('../portal/how-to/how-to.module').then(
            module => module.HowToModule
          ),
      },
      {
        path: 'request-forms',
        loadChildren: () =>
          import('./forms/admin-forms.module').then(
            module => module.AdminFormsModule
          ),
      },
      {
        path: 'tenants',
        loadChildren: () =>
          import('./tenants/tenants.module').then(
            module => module.TenantsModule
          ),
      },
      {
        path: 'insurers',
        loadChildren: () =>
          import('./insurers/insurers.module').then(
            module => module.AdminInsurersModule
          ),
      },
      {
        path: 'stripe-billing',
        loadChildren: () =>
          import('./stripe-billing/stripe-billing.module').then(
            module => module.StripeBillingModule
          ),
      },
      {
        path: 'policy-settings',
        loadChildren: () =>
          import('./policy-settings/policy-settings.module').then(
            module => module.PolicySettingsModule
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  declarations: [PortalAdminComponent],
  imports: [CommonModule, InternalLayoutModule, RouterModule.forChild(routes)],
})
export class PortalAdminModule {}
