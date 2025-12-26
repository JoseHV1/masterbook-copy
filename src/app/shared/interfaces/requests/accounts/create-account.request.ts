import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { AddressInfoRequest } from '../common/address-info.request';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';

export interface CreateAccountRequest {
  account_name: string;
  address_info: AddressInfoRequest;
  broker_id?: string;
  date_of_birth: string;
  email: string;
  first_name: string;
  gender: GenderEnum;
  last_name: string;
  marital_status: MaritalStatusEnum;
  phone_extension?: string;
  phone_number: string;
  ssn: string;
}
