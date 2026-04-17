import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { AddressInfoRequest } from 'src/app/shared/interfaces/requests/common/address-info.request';

export interface CreateLeadRequest {
  address_info: AddressInfoRequest;
  email: string;
  first_name: string;
  gender: GenderEnum;
  last_name: string;
  phone_number: string;
  capture_medium: string;
  areas_of_interest: string[];
  notes?: string;
  other_capture_medium?: string;
}
