export interface CreateQuoteRequest {
  request_id: string;
  insurance_company_id: string;
  quote_date: Date;
  prime_amount: number;
  coverage: number;
  deductible: number;
  document: string;
}
