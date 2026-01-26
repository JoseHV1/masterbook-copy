import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PrivacyPolicyCoreComponent } from './privacy-policy-core.component';

@NgModule({
  declarations: [PrivacyPolicyCoreComponent],
  imports: [CommonModule, TranslateModule],
  exports: [PrivacyPolicyCoreComponent],
})
export class PrivacyPolicyCoreModule {}
