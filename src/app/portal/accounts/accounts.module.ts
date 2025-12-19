import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountsComponent } from './accounts.component';
import { RouterModule, Routes } from '@angular/router';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./accounts-list/accounts-list.module').then(
        module => module.AccountsListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./new-accounts/new-accounts.module').then(
        module => module.NewAccountsModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./accounts-details/accounts-details.module').then(
        module => module.AccountsDetailsModule
      ),
  },
  {
    path: ':id/edit',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./edit-accounts/edit-accounts.module').then(
        module => module.EditAccountsModule
      ),
  },
];
@NgModule({
  declarations: [AccountsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [AccountsComponent],
})
export class AccountsModule {}
