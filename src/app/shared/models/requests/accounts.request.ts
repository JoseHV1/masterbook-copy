export interface AccountsRequest {
  account_custom_id: string;
  account_name: string;
  activate_user: boolean;
  additional_address_information?: string;
  address: string;
  birth_date: string;
  email: string;
  extension?: string;
  first_name: string;
  gender: string;
  identification_number: string;
  last_name: string;
  marital_status: string;
  phone: string;
  status: string;
  zip_code: string;
}
