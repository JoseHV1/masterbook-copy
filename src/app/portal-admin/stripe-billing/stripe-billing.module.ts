import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { StripeBillingComponent } from './stripe-billing.component';

const routes: Routes = [
  {
    path: '',
    component: StripeBillingComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./stripe-billing-list/stripe-billing-list.module').then(
            m => m.StripeBillingListModule,
          ),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./stripe-billing-detail/stripe-billing-detail.module').then(
        m => m.StripeBillingDetailModule,
      ),
  },
];

@NgModule({
  declarations: [StripeBillingComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class StripeBillingModule {}
