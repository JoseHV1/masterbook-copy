import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

import { SummaryCardsComponent } from './summary-cards.component';

@NgModule({
  declarations: [SummaryCardsComponent],
  imports: [CommonModule, TranslateModule, CustomPipesModule],

  exports: [SummaryCardsComponent],
})
export class SummaryCardsModule {}
