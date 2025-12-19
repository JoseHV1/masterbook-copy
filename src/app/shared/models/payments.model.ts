import { PaymentMethodEnum } from '../enums/payment-method.enum';
import { AccountModel } from '../interfaces/models/accounts.model';
import { AgencyModel } from '../interfaces/models/agency.model';
import { BrokerModel } from '../interfaces/models/broker.model';
import { InsurerModel } from '../interfaces/models/insurer.model';
import { InvoiceModel } from '../interfaces/models/invoice.model';
import { PolicyModel } from '../interfaces/models/policy.model';

export interface PaymentModel {
  _id: string;
  deletedAt?: Date;
  invoice_id: string;
  agency_id: string;
  insurer_id: string;
  policy_id: string;
  client_id: string;
  broker_id: string;
  payment_transaction_id: string;
  payment_applied: number;
  payment_date: Date;
  payment_from_data: any;
  ach_number: string;
  method: PaymentMethodEnum;
  serial: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedPaymentModel extends PaymentModel {
  agency?: AgencyModel;
  invoice?: InvoiceModel;
  insurer?: InsurerModel;
  policy?: PolicyModel;
  account?: AccountModel;
  broker?: BrokerModel;
}
