import { AccountModel } from './accounts.model';
import { AgencyModel } from './agency.model';
import { PopulatedBrokerModel } from './broker.model';
import { InsurerModel } from './insurer.model';
import { PolicyModel } from './policy.model';

export interface ClaimModel {
  _id: string;
  deletedAt?: Date;
  serial: string;
  policy_id: string;
  client_id: string;
  broker_id: string;
  agency_id: string;
  insurer_id: string;
  description: string;
  status: string;
  event_date: string;
  amount_requested: number;
  location: string;
  attachments?: ClaimAttachmentModel[];
  createdAt: string;
  updatedAt: string;
}

export interface ClaimAttachmentModel {
  name: string;
  extension: string;
  url: string;
  weight: number;
  uploaded_at: Date;
}

export interface PopulatedClaimModel extends ClaimModel {
  policy?: PolicyModel;
  client?: AccountModel;
  broker?: PopulatedBrokerModel;
  agency?: AgencyModel;
  insurer?: InsurerModel;
}
