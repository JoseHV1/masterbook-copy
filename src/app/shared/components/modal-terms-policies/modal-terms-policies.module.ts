import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTermsPoliciesComponent } from './modal-terms-policies.component';
import { TermsConditionsCoreModule } from 'src/app/anon/terms-conditions/terms-conditions-core/terms-conditions-core.module';
import { PrivacyPolicyCoreModule } from 'src/app/anon/privacy-policy/privacy-policy-core/privacy-policy-core.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ModalTermsPoliciesComponent],
  imports: [
    CommonModule,
    TermsConditionsCoreModule,
    PrivacyPolicyCoreModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [ModalTermsPoliciesComponent],
})
export class ModalTermsPoliciesModule {}
