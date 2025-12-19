import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryCardsComponent } from './summary-cards.component';

@NgModule({
  declarations: [SummaryCardsComponent],
  imports: [CommonModule],

  exports: [SummaryCardsComponent],
})
export class SummaryCardsModule {}
