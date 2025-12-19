import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvoiceComponent } from './invoice.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./invoices-list/invoices-list.module').then(
        module => module.InvoicesListModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./invoices-details/invoice-details.module').then(
        module => module.InvoiceDetailsModule
      ),
  },
];
@NgModule({
  declarations: [InvoiceComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [InvoiceComponent],
})
export class InvoiceModule {}
