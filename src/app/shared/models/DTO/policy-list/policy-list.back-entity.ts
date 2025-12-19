export interface PolicyListBackendEntity {
  id: string;
  account: PolicyListAccountBackedEntity;
  policy_number: string;
  efective_date: string;
  expiration_date: string;
  insurance_company: PolicyListInsurerBackendEntity;
  policy_prime: number;
  coverage: number;
  deductible: number;
  pending: boolean;
  status: string;
  policy_copy: string;
  request_form: string;
  renewal_document: string;
  details: string;
  created_at: string;
  updated_at: string;
  version_number: number;
  invoice: string;
  request_id: PolicyListRequestBackendEntity;
}

export interface PolicyListAccountBackedEntity {
  id: string;
  first_name: string;
  last_name: string;
  broker_id: string;
}

export interface PolicyListInsurerBackendEntity {
  id: string;
  name: string;
  insurer_custom_name: string;
}

export interface PolicyListRequestBackendEntity {
  id: string;
  request_type: string;
}
