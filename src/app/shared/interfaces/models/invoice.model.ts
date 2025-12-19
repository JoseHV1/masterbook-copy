import { AgencyModel } from 'src/app/shared/interfaces/models/agency.model';
import { InsurerModel } from './insurer.model';
import { PolicyModel } from './policy.model';
import { PopulatedBrokerModel } from './broker.model';
import { AccountModel } from './accounts.model';

export interface InvoiceModel {
  _id: string;
  deletedAt?: Date;
  agency_id: string;
  policy_id: string;
  client_id: string;
  insurer_id: string;
  broker_id: string;
  amount_due: number;
  amount_paid: number;
  status: StatusInvoiceType;
  due_date: Date;
  serial: string;
  pdf: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedInvoiceModel extends InvoiceModel {
  policy?: PolicyModel;
  insurer?: InsurerModel;
  agency?: AgencyModel;
  broker?: PopulatedBrokerModel;
  client?: AccountModel;
}

export type StatusInvoiceType = 'partially_paid' | 'paid' | 'pending';
