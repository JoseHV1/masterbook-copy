export interface PolicyBackendEntity {
  account_id: string;
  action_type: string;
  coverage: number;
  deductible: number;
  details: string;
  efective_date: string;
  expiration_date: string;
  insurance_company: string;
  pending: boolean;
  policy_copy: string;
  policy_number: string;
  policy_prime: number;
  renewal_document: string;
  request_form: string;
  request_id?: string;
  status: string;
}
