import { AccountStatusEnum } from '../../enums/account-status.enum';
import { AgencyModel } from './agency.model';
import { PopulatedBrokerModel } from './broker.model';
import { UserModel } from './user.model';

export interface AccountModel {
  _id: string;
  user_id: string;
  broker_id: string;
  agency_id: string;
  deletedAt?: Date;
  serial: string;
  ssn: string;
  account_name: string;
  status: AccountStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedAccount extends AccountModel {
  agency?: AgencyModel;
  broker?: PopulatedBrokerModel;
  user?: UserModel;
}
