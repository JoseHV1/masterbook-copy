import { BrokerStatusEnum } from '../../enums/broker-status.enum';
import { AgencyModel } from './agency.model';
import { BusinessLineModel } from './business-line.model';
import { UserModel } from './user.model';

export interface BrokerModel {
  _id: string;
  user_id: string;
  agency_id: string;
  deletedAt?: Date;
  serial: string;
  license_number: string;
  license_expires_at: Date;
  position: string;
  status: BrokerStatusEnum;
  business_lines: string[];
  createdAt: Date;
  updatedAt: Date;
  contact_number?: string;
  can_show_contact_number?: boolean;
}

export interface PopulatedBrokerModel extends BrokerModel {
  user?: UserModel;
  agency?: AgencyModel;
  lines?: BusinessLineModel[];
}
