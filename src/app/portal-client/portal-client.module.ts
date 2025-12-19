import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './portal-client.component';
import { RouterModule, Routes } from '@angular/router';
import { InternalLayoutModule } from '../shared/layouts/internal-layout/internal-layout.module';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            module => module.DashboardModule
          ),
      },
      {
        path: 'requests',
        loadChildren: () =>
          import('../portal/requests/requests.module').then(
            module => module.RequestsModule
          ),
      },
      {
        path: 'policies',
        loadChildren: () =>
          import('../portal/policies/policies.module').then(
            module => module.PoliciesModule
          ),
      },
      {
        path: 'my-broker',
        loadChildren: () =>
          import('./my-broker/my-broker.module').then(
            module => module.MyBrokerModule
          ),
      },
      {
        path: 'claims',
        loadChildren: () =>
          import('./claims/claims.module').then(module => module.ClaimsModule),
      },
      {
        path: 'invoices',
        loadChildren: () =>
          import('../portal/financials/invoices/invoice.module').then(
            module => module.InvoiceModule
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('../portal/profile/profile.module').then(
            module => module.ProfileModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [AdminComponent],
  imports: [CommonModule, InternalLayoutModule, RouterModule.forChild(routes)],
})
export class PortalClientModule {}
