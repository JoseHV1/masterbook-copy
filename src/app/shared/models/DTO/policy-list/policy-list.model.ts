export interface PolicyListModel {
  id: string;
  account: PolicyListAccountModel;
  policy_number: string;
  efective_date: Date;
  expiration_date: Date;
  insurance_company: PolicyListInsurerModel;
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
  version_number: number;
  invoice: string;
  request_id: PolicyListRequestModel;
}

export interface PolicyListAccountModel {
  id: string;
  first_name: string;
  last_name: string;
  broker_id: string;
}

export interface PolicyListInsurerModel {
  id: string;
  name: string;
  insurer_custom_name: string;
}

export interface PolicyListRequestModel {
  id: string;
  request_type: string;
}
