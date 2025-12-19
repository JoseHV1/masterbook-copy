import { AddressInfoRequest } from '../common/address-info.request';

export interface CompleteRegisterAgencyBrokerAdminRequest {
  photo_base64?: string;
  name?: string;
  position?: string;
  license_number: string;
  license_expires_at: string;
  phone_number: string;
  staff_size?: number;
  address_info: AddressInfoRequest;
  accepted_terms_conditions: boolean;
}
