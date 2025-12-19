import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentErrorComponent } from './payment-error.component';

const routes: Routes = [
  {
    path: '',
    component: PaymentErrorComponent,
  },
];

@NgModule({
  declarations: [PaymentErrorComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PaymentErrorModule {}
