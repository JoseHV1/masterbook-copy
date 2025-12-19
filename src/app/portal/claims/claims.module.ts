import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

import { ClaimsComponent } from './claims.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./claims-list/claims-list.module').then(
        module => module.ClaimsListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./new-claims/new-claims.module').then(
        module => module.NewClaimModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./claims-details/claims-details.module').then(
        module => module.ClaimsDetailsModule
      ),
  },
  {
    path: ':id/edit',
    loadChildren: () =>
      import('./edit-claims/edit-claims.module').then(
        module => module.EditClaimsModule
      ),
  },
];

@NgModule({
  declarations: [ClaimsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [ClaimsComponent],
})
export class ClaimsModule {}
