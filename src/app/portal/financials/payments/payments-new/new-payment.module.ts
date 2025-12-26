import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPaymentComponent } from './new-payment.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { FormPaymentsModule } from '../components/form-payments/form-payments.module';

const routes: Routes = [
  {
    path: '',
    component: NewPaymentComponent,
  },
];

@NgModule({
  declarations: [NewPaymentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormPaymentsModule,
  ],
  exports: [NewPaymentComponent],
})
export class NewPaymentModule {}
