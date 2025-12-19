import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ButtonComponent } from './button/button.component';
import { InputComponent } from './input/input.component';
import { AutocompleteComponent } from './autoComplete/autocomplete.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { DateFieldComponent } from './datePicker/datepicker.component';
import { DropdownComponent } from './dropDown/dropdown.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { AddressInputComponent } from './address-input/address-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { InsurerSelectorComponent } from './insurer-selector/insurer-selector.component';
import { PolicySelectorComponent } from './policy-selector/policy-selector.component';
import { AgentSelectorComponent } from './agent-selector/agent-selector.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AccountSelectorComponent } from './account-selector/account-selector.component';
import { ImportMultiFileComponent } from './import-multi-file/import-multi-file.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MultiFileUploadComponent } from './multi-file-upload/multi-file-upload.component';
import { FilePickerComponent } from './file-picker/file-picker.component';
import { InsuranceCompanySelectorComponent } from './insurance-company-selector/insurance-company-selector.component';
import { CustomPipesModule } from '@app/shared/pipes/custom-pipes.module';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ButtonComponent,
    InputComponent,
    AutocompleteComponent,
    CheckboxComponent,
    FileUploadComponent,
    DateFieldComponent,
    DropdownComponent,
    AddressInputComponent,
    InsurerSelectorComponent,
    PolicySelectorComponent,
    AgentSelectorComponent,
    AccountSelectorComponent,
    ImportMultiFileComponent,
    MultiFileUploadComponent,
    FilePickerComponent,
    InsuranceCompanySelectorComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AddressAutocompleteGoogleModule,
    MatAutocompleteModule,
    MatTooltipModule,
    CustomPipesModule,
    MatChipsModule,
    MatIconModule,
    MatInputModule,
  ],
  providers: [provideNgxMask()],
  exports: [
    ButtonComponent,
    InputComponent,
    AutocompleteComponent,
    CheckboxComponent,
    FileUploadComponent,
    DateFieldComponent,
    DropdownComponent,
    AddressInputComponent,
    InsurerSelectorComponent,
    PolicySelectorComponent,
    AgentSelectorComponent,
    AccountSelectorComponent,
    ImportMultiFileComponent,
    MultiFileUploadComponent,
    FilePickerComponent,
    InsuranceCompanySelectorComponent,
  ],
})
export class CDKModule {}
