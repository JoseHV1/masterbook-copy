import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormAgencyLeadComponent } from './form-agency-lead.component';

@NgModule({
  declarations: [FormAgencyLeadComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule],
  exports: [FormAgencyLeadComponent],
})
export class FormAgencyLeadModule {}
