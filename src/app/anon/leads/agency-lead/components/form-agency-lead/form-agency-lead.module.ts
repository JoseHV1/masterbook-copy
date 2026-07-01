import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormAgencyLeadComponent } from './form-agency-lead.component';

@NgModule({
  declarations: [FormAgencyLeadComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CDKModule],
  exports: [FormAgencyLeadComponent],
})
export class FormAgencyLeadModule {}
