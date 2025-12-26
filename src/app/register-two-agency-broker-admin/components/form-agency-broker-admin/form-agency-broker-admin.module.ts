import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAgencyBrokerAdminComponent } from './form-agency-broker-admin.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { ModalTermsPoliciesModule } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.module';

@NgModule({
  declarations: [FormAgencyBrokerAdminComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PictureSelectorModule,
    MultiSelectModule,
    CalendarModule,
    InputTextModule,
    CheckboxModule,
    TooltipModule,
    InputNumberModule,
    InputTextareaModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AddressAutocompleteGoogleModule,
    ModalTermsPoliciesModule,
  ],
  providers: [provideNgxMask()],
  exports: [FormAgencyBrokerAdminComponent],
})
export class FormAgencyBrokerAdminModule {}
