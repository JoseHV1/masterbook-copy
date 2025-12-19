import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import {
  AddressAutocompleteModel,
  GeocoderAddress,
} from '../../models/address-autocomplete.model';

declare const google: any;

@Directive({
  selector: '[appAddressAutocomplete]',
})
export class AddressAutocompleteGoogleDirective {
  @Output() updateAddress: EventEmitter<AddressAutocompleteModel> =
    new EventEmitter();
  @Output() updateFieldAddress: EventEmitter<string> = new EventEmitter();

  constructor(private autoCompleteAddressInput: ElementRef) {
    this.setAutocomplete();
    this.onListenInputChange();
  }

  setAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.autoCompleteAddressInput.nativeElement
    );

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
      const { address_components, formatted_address, geometry } =
        autocomplete.getPlace();

      const data: AddressAutocompleteModel = {
        country: this.getComponent(address_components, 'country') ?? '',
        zipcode: this.getComponent(address_components, 'postal_code'),
        address: formatted_address,
        latitude: geometry.location.lat(),
        longitude: geometry.location.lng(),
      };

      this.updateAddress.emit(data);
    });
  }

  private getComponent(addressComponents: GeocoderAddress[], type: string) {
    const component = addressComponents.find((c: any) =>
      c.types.includes(type)
    );
    return component?.long_name ?? undefined;
  }

  onListenInputChange() {
    this.autoCompleteAddressInput.nativeElement.addEventListener(
      'input',
      (event: any) => {
        const value = this.autoCompleteAddressInput.nativeElement.value;
        this.updateFieldAddress.emit(value);
      }
    );
  }
}
