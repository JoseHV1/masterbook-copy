import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TermsConditionsCoreComponent } from './terms-conditions-core.component';

@NgModule({
  declarations: [TermsConditionsCoreComponent],
  imports: [CommonModule, TranslateModule],
  exports: [TermsConditionsCoreComponent],
})
export class TermsConditionsCoreModule {}
