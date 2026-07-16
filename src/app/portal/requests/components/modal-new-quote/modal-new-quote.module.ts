import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalNewQuoteComponent } from './modal-new-quote.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyInputModule } from 'src/app/shared/components/currency-input/currency-input.module';
import { DateInputModule } from 'src/app/shared/components/date-input/date-input.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalNewQuoteComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CDKModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    CurrencyInputModule,
    DateInputModule,
  ],
  exports: [ModalNewQuoteComponent],
})
export class ModalNewQuoteModule {}
