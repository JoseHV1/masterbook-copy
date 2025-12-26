export interface PoliciesModel {
  id: string;
  policy_number: number;
  efective_date: Date;
  expiration_date: Date;
  insurance_company?: InsurerDetailsModel;
  policy_prime: number;
  coverage: number;
  deductible: number;
  pending: boolean;
  status: string;
  policy_copy: string;
  request_form: string;
  renewal_document: string;
  details: string;
  created_at: Date;
  updated_at: Date;
  account: AccountInfoModel;
  action_type?: string;
  version_number?: number;
  invoice_id?: string;
  request_id?: {
    id: string;
    request_type: string;
  };
}

interface AccountInfoModel {
  id: string;
  first_name: string;
  last_name: string;
  broker_id: string;
}

interface InsurerDetailsModel {
  id: string;
  name: string;
  insurer_custom_name: string;
}
