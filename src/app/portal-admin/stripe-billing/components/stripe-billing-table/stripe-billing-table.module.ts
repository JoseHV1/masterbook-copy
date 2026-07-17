import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { StripeBillingTableComponent } from './stripe-billing-table.component';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { StripeEventLabelPipe } from '../../pipes/stripe-event-label.pipe';

@NgModule({
  declarations: [StripeBillingTableComponent, StripeEventLabelPipe],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule,
    FiltersModule,
  ],
  exports: [StripeBillingTableComponent],
})
export class StripeBillingTableModule {}
