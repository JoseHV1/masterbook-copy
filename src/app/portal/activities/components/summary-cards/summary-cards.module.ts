import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SummaryCardsComponent } from './summary-cards.component';

@NgModule({
  declarations: [SummaryCardsComponent],
  imports: [CommonModule, TranslateModule],

  exports: [SummaryCardsComponent],
})
export class SummaryCardsModule {}
