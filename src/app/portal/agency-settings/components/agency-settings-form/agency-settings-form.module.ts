import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencySettingsFormComponent } from './agency-settings-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [AgencySettingsFormComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule],
  exports: [AgencySettingsFormComponent],
})
export class AgencySettingsFormModule {}
