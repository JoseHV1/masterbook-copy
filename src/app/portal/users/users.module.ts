import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { RouterModule, Routes } from '@angular/router';
import { OwnerGuard } from '../../shared/guards/owner.guard';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./users-list/users-list.module').then(
        module => module.UsersListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./new-users/new-users.module').then(
        module => module.NewUsersModule
      ),
    canActivate: [OwnerGuard],
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./user-details/user-details.module').then(
        module => module.AccountsDetailsModule
      ),
  },
  {
    path: ':id/edit',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./edit-user/edit-user.module').then(
        module => module.EditUserModule
      ),
  },
];
@NgModule({
  declarations: [UsersComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [UsersComponent],
})
export class UsersModule {}
