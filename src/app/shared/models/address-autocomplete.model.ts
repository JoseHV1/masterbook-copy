export interface AddressAutocompleteModel {
  address: string;
  country: string;
  zipcode?: string;
  latitude: number;
  longitude: number;
}

export interface AddressDataModel {
  city: string;
  state: string;
  county: string;
  zip_code: any;
}

export interface GeocoderAddress {
  long_name: string;
  short_name: string;
  types: string[];
}
