import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PoliciesComponent } from './policies.component';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./policies-list/policies-list.module').then(
        module => module.PoliciesListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./new-policies/new-policies.module').then(
        module => module.NewPoliciesModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./policies-details/policies-details.module').then(
        module => module.PoliciesDetailsModule
      ),
  },
  {
    path: ':id/edit',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./edit-policies/edit-policies.module').then(
        module => module.EditPoliciesModule
      ),
  },
];

@NgModule({
  declarations: [PoliciesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [PoliciesComponent],
})
export class PoliciesModule {}
