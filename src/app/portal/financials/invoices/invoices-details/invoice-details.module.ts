import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceDetailsComponent } from './invoice-details.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CommissionsListModule } from './components/commissions-list/commissions-list.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { PaymentsListModule } from '../../payments/components/payments-list/payments-list.module';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: InvoiceDetailsComponent,
  },
];

@NgModule({
  declarations: [InvoiceDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    CommissionsListModule,
    CustomPipesModule,
    PaymentsListModule,
    MatExpansionModule,
    MatTooltipModule,
  ],
  exports: [InvoiceDetailsComponent],
})
export class InvoiceDetailsModule {}
