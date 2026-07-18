import { NgModule } from '@angular/core';
import { StripeEventLabelPipe } from './stripe-event-label.pipe';

@NgModule({
  declarations: [StripeEventLabelPipe],
  exports: [StripeEventLabelPipe],
})
export class StripeEventLabelPipeModule {}
