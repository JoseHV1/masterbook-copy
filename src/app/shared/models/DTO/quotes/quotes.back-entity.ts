export interface QuotesBackendEntity {
  id: string;
  insurance_type: string;
  created_at: string;
  updated_at: string;
  policy_prime: string;
  coverage_amount: string;
  deductible: string;
  url: string;
  status: string;
  request_id?: string;
  date_of_quotes?: string;
  account?: {
    id: string;
    first_name: string;
    last_name: string;
  };
}
