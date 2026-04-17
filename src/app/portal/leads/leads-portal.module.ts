import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./leads-list/leads-list.module').then(
        module => module.LeadsListModule
      ),
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./lead-detail/lead-detail.module').then(
        module => module.LeadDetailModule
      ),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class LeadsPortalModule {}
