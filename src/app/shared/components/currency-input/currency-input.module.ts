import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { CurrencyInputComponent } from './currency-input.component';

@NgModule({
  declarations: [CurrencyInputComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule],
  exports: [CurrencyInputComponent],
})
export class CurrencyInputModule {}
