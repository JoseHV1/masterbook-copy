import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { FormLeadComponent } from './form-lead.component';
import { AddressAutocompleteGoogleModule } from '@app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  declarations: [FormLeadComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, DirectivesModule, CDKModule, AddressAutocompleteGoogleModule, MultiSelectModule],
  exports: [FormLeadComponent],
})
export class FormLeadModule {}
