import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { AnonLayoutModule } from '../shared/layouts/anon-layout/anon-layout.module';

const routes: Routes = [
  {
    path: '',
    component: LeadsComponent,
    children: [
      {
        path: 'register',
        loadChildren: () =>
          import('../anon/register-lead/register-lead.module').then(
            module => module.RegisterLeadModule
          ),
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./leads-list/leads-list.module').then(
            module => module.LeadsListModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [LeadsComponent],
  imports: [CommonModule, AnonLayoutModule, RouterModule.forChild(routes)],
})
export class LeadsModule {}
