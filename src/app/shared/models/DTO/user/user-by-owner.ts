import { GenderEnum } from 'src/app/shared/enums/gender.enum';

export interface UserByOwnerModel {
  id: string;
  type_of_user: any;
  birthday: Date;
  email: string;
  name: string;
  license_number: string;
  last_name: string;
  phone_number: string;
  created_at: Date;
  updated_at: Date;
  license_expiry_date: Date;
  business_line: string;
  rol: string; //this should be an enum later
  gender: GenderEnum;
}
