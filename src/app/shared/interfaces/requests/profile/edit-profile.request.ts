import { AddressInfoRequest } from '../common/address-info.request';

export interface EditProfileRequest {
  photo_base64?: string;
  license_number: string;
  license_expires_at: string;
  phone_number: string;
  phone_extension?: number;
  gender: string;
  address_info: AddressInfoRequest;
  allow_email_notifications: boolean;
  days_expiring_policies_notifications: number | null;
}
