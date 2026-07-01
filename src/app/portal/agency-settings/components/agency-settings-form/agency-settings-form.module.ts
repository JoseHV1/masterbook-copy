import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencySettingsFormComponent } from './agency-settings-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { PictureSelectorModule } from '@app/shared/components/picture-selector/picture-selector.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AgencySettingsFormComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    FormsModule,
    CDKModule,
    PictureSelectorModule,
    MultiSelectModule,
    InputTextModule,
    CheckboxModule,
    TooltipModule,
  ],
  exports: [AgencySettingsFormComponent],
})
export class AgencySettingsFormModule { }
