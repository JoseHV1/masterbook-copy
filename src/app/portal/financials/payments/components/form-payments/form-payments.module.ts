import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormPaymentsComponent } from './form-payments.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { DropdownModule } from 'primeng/dropdown';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { CheckboxModule } from 'primeng/checkbox';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatRadioModule } from '@angular/material/radio';

@NgModule({
  declarations: [FormPaymentsComponent],
  imports: [
    CommonModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
    DirectivesModule,
    AddressAutocompleteGoogleModule,
    CheckboxModule,
    AutoCompleteModule,
    CDKModule,
    MatRadioModule,
  ],
  exports: [FormPaymentsComponent],
})
export class FormPaymentsModule {}
