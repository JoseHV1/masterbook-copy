import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDetailsComponent } from './payment-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { PaymentsListModule } from '../components/payments-list/payments-list.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

const routes: Routes = [
  {
    path: '',
    component: PaymentDetailsComponent,
  },
];

@NgModule({
  declarations: [PaymentDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CustomPipesModule,
    PaymentsListModule,
    MatExpansionModule,
    MatTooltipModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [PaymentDetailsComponent],
})
export class PaymentDetailsModule {}
