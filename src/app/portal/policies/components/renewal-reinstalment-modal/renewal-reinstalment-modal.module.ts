import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { RenewalReinstalmentModelComponent } from './renewal-reinstalment-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { CurrencyInputModule } from 'src/app/shared/components/currency-input/currency-input.module';

@NgModule({
  declarations: [RenewalReinstalmentModelComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CDKModule, TranslateModule, CurrencyInputModule],
  exports: [RenewalReinstalmentModelComponent],
})
export class RenewalReinstalmentModalModule {}
