import { AddressInfoRequest } from '../common/address-info.request';

export interface CompleteRegisterInsuredRequest {
  first_name: string;
  last_name: string;
  photo_base64?: string;
  marital_status: string;
  gender: string;
  phone_number: string;
  phone_extension: string;
  address_info: AddressInfoRequest;
  accepted_terms_conditions: boolean;
  account_name?: string;
  ssn?: string;
  status?: string;
  date_of_birth?: string;
}
