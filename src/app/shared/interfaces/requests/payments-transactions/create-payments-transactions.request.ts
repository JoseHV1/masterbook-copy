import { CreatePaymentRequest } from '../payments/create-payments.request';

export interface CreatePaymentsTransactionsRequest {
  total_amount: number;
  ach_number: string;
  date: string;
  method: string;
  retentions: number;
  taxes: number;
  subtotal: number;
  payment_from: string;
  payments: CreatePaymentRequest;
}
