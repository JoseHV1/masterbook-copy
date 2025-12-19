export interface AddressInfoModel {
  address: string;
  country: string;
  latitude: number;
  longitude: number;
  additional_address?: string;
  zipcode?: string;
}
