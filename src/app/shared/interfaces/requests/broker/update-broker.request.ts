import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { NewBrokerRolesEnum } from 'src/app/shared/enums/roles.enum';

export interface UpdateBrokerRequest {
  first_name: string;
  last_name: string;
  role: NewBrokerRolesEnum;
  phone_number: string;
  business_lines: string[];
  license_number: string;
  license_expires_at: string;
  date_of_birth: string;
  gender: GenderEnum;
}
