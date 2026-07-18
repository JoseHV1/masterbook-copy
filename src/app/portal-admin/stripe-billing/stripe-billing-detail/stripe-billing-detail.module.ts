import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StripeBillingDetailComponent } from './stripe-billing-detail.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { StripeEventLabelPipeModule } from '../pipes/stripe-event-label-pipe.module';

const routes: Routes = [{ path: '', component: StripeBillingDetailComponent }];

@NgModule({
  declarations: [StripeBillingDetailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    PagesLayoutModule,
    StripeEventLabelPipeModule,
  ],
})
export class StripeBillingDetailModule {}
