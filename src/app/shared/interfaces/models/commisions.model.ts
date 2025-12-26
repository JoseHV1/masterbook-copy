import { PaymentModel } from '../../models/payments.model';
import { AgencyModel } from './agency.model';
import { PopulatedBrokerModel } from './broker.model';
import { InvoiceModel } from './invoice.model';
import { PolicyModel } from './policy.model';

export interface CommissionModel {
  _id: string;
  deletedAt?: Date;
  payment_id: string;
  broker_id: string;
  policy_id: string;
  agency_id: string;
  invoice_id: string;
  amount: number;
  percentage: number;
  serial: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedCommisionModel extends CommissionModel {
  policy?: PolicyModel;
  invoice?: InvoiceModel;
  broker?: PopulatedBrokerModel;
  agency?: AgencyModel;
  payments?: PaymentModel;
}
