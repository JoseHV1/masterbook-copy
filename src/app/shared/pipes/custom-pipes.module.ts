import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NotNullPipe } from './not-null.pipe';
import { ShortPipe } from './short.pipe';
import { PhonePipe } from './phone.pipe';
import { EnumPipe } from './enum.pipe';
import { SafeUrlPipe } from './safe-url.pipe';
import { FilePipe } from './file.pipe';
import { WeightPipe } from './weight.pipe';
import { NormalizeTextPipe } from './normalize-text.pipe';
import { CountryCodePipe } from './country-code.pipe';
import { AppDateTimePipe } from './app-date-time.pipe';

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
    AppDateTimePipe,
  ],
  imports: [CommonModule],
  providers: [DatePipe],
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
    AppDateTimePipe,
  ],
})
export class CustomPipesModule {}
