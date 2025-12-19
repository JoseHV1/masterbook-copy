export interface AddressInfoRequest {
  address: string;
  additional_address?: string;
  country?: string;
  latitude: number;
  longitude: number;
  zipcode?: string;
}
