import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LeadsComponent } from './leads.component';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent,
    children: [
      {
        path: 'register',
        loadChildren: () =>
          import('./register-lead/register-lead.module').then(
            module => module.RegisterLeadModule
          ),
      },
      {
        path: 'agency',
        loadChildren: () =>
          import('./agency-lead/agency-lead.module').then(
            module => module.AgencyLeadModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [LeadsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LeadsModule {}
