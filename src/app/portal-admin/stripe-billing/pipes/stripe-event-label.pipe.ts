import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'stripeEventLabel', pure: true })
export class StripeEventLabelPipe implements PipeTransform {
  transform(eventType: string): string {
    if (!eventType) return '';
    return 'STRIPE_EVENTS.' + eventType.replace(/\./g, '_').toUpperCase();
  }
}
