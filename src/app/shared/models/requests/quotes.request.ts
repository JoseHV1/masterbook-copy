export interface QuotesRequest {
  insurance_type: string;
  policy_prime: string;
  coverage_amount: string;
  deductible: string;
  status: string;
  request_id: string;
  pdf_base64: string;
  date_of_quotes?: string;
}
