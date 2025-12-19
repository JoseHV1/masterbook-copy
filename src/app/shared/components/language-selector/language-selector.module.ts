import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSelectorComponent } from './language-selector.component';

@NgModule({
  declarations: [LanguageSelectorComponent],
  imports: [CommonModule],
  exports: [LanguageSelectorComponent],
})
export class LanguageSelectorModule {}
