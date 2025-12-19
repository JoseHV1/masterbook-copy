import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileFormComponent } from './profile-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { AddressAutocompleteGoogleModule } from 'src/app/shared/directives/addres-autocomplete-google/address-autocomplete-google.module';
import { CheckboxModule } from 'primeng/checkbox';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { ModalChangePasswordModule } from '../modal-change-password/modal-change-password.module';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ProfileFormComponent],
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    AddressAutocompleteGoogleModule,
    CheckboxModule,
    CDKModule,
    PictureSelectorModule,
    ModalChangePasswordModule,
    MatCheckboxModule,
  ],
  exports: [ProfileFormComponent],
})
export class ProfileFormModule {}
