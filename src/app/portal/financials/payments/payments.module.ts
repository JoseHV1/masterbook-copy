import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsComponent } from './payments.component';
import { RouterModule, Routes } from '@angular/router';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./payments-list/payments-list.module').then(
        module => module.PaymentsListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./payments-new/new-payment.module').then(
        module => module.NewPaymentModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./payments-details/payment-details.module').then(
        module => module.PaymentDetailsModule
      ),
  },
];
@NgModule({
  declarations: [PaymentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [PaymentsComponent],
})
export class PaymentsModule {}
