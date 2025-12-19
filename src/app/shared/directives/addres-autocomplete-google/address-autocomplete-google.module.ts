import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressAutocompleteGoogleDirective } from './address-autocomplete-google.directive';

@NgModule({
  declarations: [AddressAutocompleteGoogleDirective],
  imports: [CommonModule],
  exports: [AddressAutocompleteGoogleDirective],
})
export class AddressAutocompleteGoogleModule {}
