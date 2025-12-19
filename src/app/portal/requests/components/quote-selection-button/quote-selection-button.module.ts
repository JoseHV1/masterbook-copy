import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuoteSelectionButtonComponent } from './quote-selection-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [QuoteSelectionButtonComponent],
  imports: [CommonModule, MatTooltipModule, MatMenuModule],
  exports: [QuoteSelectionButtonComponent],
})
export class QuoteSelectionButtonModule {}
