import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAgencyComponent } from './form-agency.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { MatDialogModule } from '@angular/material/dialog';
import { ModalTermsPoliciesModule } from 'src/app/shared/components/modal-terms-policies/modal-terms-policies.module';

@NgModule({
  declarations: [FormAgencyComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CheckboxModule,
    TooltipModule,
    InputTextModule,
    PictureSelectorModule,
    CalendarModule,
    DropdownModule,
    MultiSelectModule,
    InputTextareaModule,
    InputNumberModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AddressAutocompleteGoogleModule,
    DropdownModule,
    MatDialogModule,
    ModalTermsPoliciesModule,
  ],
  providers: [provideNgxMask()],
  exports: [FormAgencyComponent],
})
export class FormAgencyModule {}
