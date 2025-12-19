import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PaymentsComponent } from './payments.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    component: PaymentsComponent,
  },
];

@NgModule({
  declarations: [PaymentsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
  exports: [PaymentsComponent],
})
export class PaymentsModule {}
