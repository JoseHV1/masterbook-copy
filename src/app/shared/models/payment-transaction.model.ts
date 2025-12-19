import { PaymentTransactionMethodEnum } from '../enums/payment-transaction-method.enum';
import { PaymentTransactionStatusEnum } from '../enums/payment-transaction-status.enum';
import { AccountModel } from '../interfaces/models/accounts.model';
import { AgencyModel } from '../interfaces/models/agency.model';
import { InsurerModel } from '../interfaces/models/insurer.model';
import { PopulatedPaymentModel } from './payments.model';

export interface PaymentTransactionModel {
  _id: string;
  deletedAt?: Date;
  serial: string;
  agency_id: string;
  account_id: string;
  insurer_id: string;
  method: PaymentTransactionMethodEnum;
  ach_number: string;
  total_amount: number;
  subtotal: number;
  taxes: number;
  retentions: number;
  remaining_balance: number;
  payment_date: Date;
  payment_from: string;
  payment_from_data: any;
  status: PaymentTransactionStatusEnum;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedPaymentTransactionModel
  extends PaymentTransactionModel {
  agency?: AgencyModel;
  account?: AccountModel;
  insurer?: InsurerModel;
  payments?: PopulatedPaymentModel[];
}
