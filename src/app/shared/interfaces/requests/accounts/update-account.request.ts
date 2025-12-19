import { AccountStatusEnum } from 'src/app/shared/enums/account-status.enum';
import { AddressInfoRequest } from '../common/address-info.request';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';

export interface UpdateAccountRequest {
  account_name: string;
  first_name: string;
  last_name: string;
  ssn: string;
  status?: AccountStatusEnum;
  phone_number: string;
  phone_extension?: string;
  address_info: AddressInfoRequest;
  broker_id?: string;
  gender: GenderEnum;
  date_of_birth: string;
  marital_status: MaritalStatusEnum;
}
