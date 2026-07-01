import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentSuccessComponent } from './payment-success.component';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: PaymentSuccessComponent,
  },
];

@NgModule({
  declarations: [PaymentSuccessComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
})
export class PaymentSuccessModule {}
