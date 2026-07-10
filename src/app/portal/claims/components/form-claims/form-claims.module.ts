import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormClaimsComponent } from './form-claims.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DirectivesModule } from 'src/app/shared/helpers/directives/directives.module';
import { DropdownModule } from 'primeng/dropdown';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { CheckboxModule } from 'primeng/checkbox';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FilePreviewModalModule } from '../file-preview-modal/file-preview-modal.module';
import { CurrencyInputModule } from 'src/app/shared/components/currency-input/currency-input.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormClaimsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTooltipModule,
    InputTextModule,
    ButtonModule,
    CalendarModule,
    InputNumberModule,
    ReactiveFormsModule,
    DropdownModule,
    DirectivesModule,
    AddressAutocompleteGoogleModule,
    CheckboxModule,
    CDKModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    FilePreviewModalModule,
    CurrencyInputModule,
  ],
  exports: [FormClaimsComponent],
})
export class FormClaimsModule {}
