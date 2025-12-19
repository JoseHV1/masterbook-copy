import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotNullPipe } from './not-null.pipe';
import { ShortPipe } from './short.pipe';
import { PhonePipe } from './phone.pipe';
import { EnumPipe } from './enum.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { FilePipe } from './file.pipe';
import { WeightPipe } from './weight.pipe';
import { NormalizeTextPipe } from './normalize-text.pipe';
import { CountryCodePipe } from './country-code.pipe';

@NgModule({
  declarations: [
    NotNullPipe,
    ShortPipe,
    PhonePipe,
    EnumPipe,
    SafeUrlPipe,
    FilePipe,
    WeightPipe,
    NormalizeTextPipe,
    CountryCodePipe,
  ],
  imports: [CommonModule],
  exports: [
    NotNullPipe,
    ShortPipe,
    PhonePipe,
    EnumPipe,
    SafeUrlPipe,
    FilePipe,
    WeightPipe,
    NormalizeTextPipe,
    CountryCodePipe,
  ],
})
export class CustomPipesModule {}
