import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteRequestsComponent } from './requests.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { PaymentGuard } from 'src/app/shared/guards/payment.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/requests-list/requests-list.module').then(
        module => module.RequestListModule
      ),
  },
  {
    path: 'new',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./pages/new-request/new-request.module').then(
        module => module.NewRequestModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./pages/request-detail/request-detail.module').then(
        module => module.RequestDetailModule
      ),
  },
  {
    path: ':id/edit',
    canActivateChild: [PaymentGuard],
    loadChildren: () =>
      import('./pages/edit-request/edit-request.module').then(
        module => module.EditRequestModule
      ),
  },
];

@NgModule({
  declarations: [QuoteRequestsComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
})
export class RequestsModule {}
