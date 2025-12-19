export interface CreatePaymentRequest {
  ach_number: string;
  agency_id: string;
  broker_id: string;
  client_id: string;
  insurance_company_id: string;
  invoice_id: string;
  payment_applied: number;
  payment_date: string;
  policy_id: string;
}
