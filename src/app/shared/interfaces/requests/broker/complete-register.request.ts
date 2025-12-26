import { CompleteRegisterRolesEnum } from 'src/app/shared/enums/roles.enum';
import { AddressInfoRequest } from '../common/address-info.request';

export interface CompleteRegisterRequest {
  role: CompleteRegisterRolesEnum;
  photo_base64?: string;
  logo_base64?: string;
  check_branding: boolean;
  name?: string;
  position?: string;
  license_number: string;
  license_expires_at: string;
  phone_number: string;
  staff_size?: number;
  address_info: AddressInfoRequest;
  business_lines: string[];
  accepted_terms_conditions: boolean;
}
