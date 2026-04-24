import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';

export interface ConvertLeadRequest {
  account_name: string;
  ssn: string;
  date_of_birth: string;
  marital_status: MaritalStatusEnum;
  phone_extension?: string;
  broker_id?: string;
}
