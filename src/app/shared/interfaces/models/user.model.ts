import { RolesEnum } from '../../enums/roles.enum';
import { AgencyModel } from './agency.model';
import { BrokerModel } from './broker.model';
import { AddressInfoModel } from './address-info.model';
import { AccountModel } from './accounts.model';

export interface UserModel {
  _id: string;
  account_id?: string;
  agency_id?: string;
  broker_id?: string;
  deletedAt?: Date;
  serial: string;
  role: RolesEnum;
  email: string;
  first_name: string;
  last_name: string;
  gender?: string;
  marital_status?: string;
  photo_url?: string;
  date_of_birth?: Date;
  phone_number: string;
  phone_extension?: string;
  address_info?: AddressInfoModel;
  complete_tutors?: string[];
  email_verified_at?: Date;
  last_login_at?: Date;
  createdAt: Date;
  updatedAt: Date;
  accepted_terms_conditions_at: Date;
  allow_email_notifications?: boolean;
  days_expiring_policies_notifications: number | null;
}

export interface PopulatedUserModel extends UserModel {
  agency: AgencyModel;
  broker?: BrokerModel;
  account?: AccountModel;
}
