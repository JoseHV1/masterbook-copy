import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminLeadsComponent } from './leads.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLeadsComponent,
    children: [
      { path: '', redirectTo: 'account', pathMatch: 'full' },
      {
        path: 'account',
        loadChildren: () =>
          import('./account/account-leads.module').then(
            m => m.AccountLeadsModule
          ),
      },
      {
        path: 'agencies',
        loadChildren: () =>
          import('./agencies/agencies-leads.module').then(
            m => m.AgenciesLeadsModule
          ),
      },
    ],
  },
  {
    path: 'account/:serial/transfer',
    loadChildren: () =>
      import('./transfer-lead/transfer-lead.module').then(
        m => m.TransferLeadModule
      ),
  },
  {
    path: 'account/:serial',
    loadChildren: () =>
      import('./lead-detail/admin-lead-detail.module').then(
        m => m.AdminLeadDetailModule
      ),
  },
  {
    path: 'agencies/:serial',
    loadChildren: () =>
      import('./agency-lead-detail/agency-lead-detail.module').then(
        m => m.AgencyLeadDetailModule
      ),
  },
];

@NgModule({
  declarations: [AdminLeadsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminLeadsModule {}
