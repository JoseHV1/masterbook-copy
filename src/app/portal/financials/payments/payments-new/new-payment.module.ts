import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPaymentComponent } from './new-payment.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { FormPaymentsModule } from '../components/form-payments/form-payments.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    TranslateModule,
    MatTooltipModule,
  ],
  exports: [NewPaymentComponent],
})
export class NewPaymentModule {}
