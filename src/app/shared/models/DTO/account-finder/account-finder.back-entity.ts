export interface AccountsFinderBackendEntity {
  id: string;
  account_custom_id: string;
  account_name: string;
  additional_address_information: string;
  address: string;
  agency_id: string;
  birth_date: Date;
  broker: BrokerDetailsBackEntity;
  email: string;
  extension: number;
  first_name: string;
  gender: string;
  identification_number: number;
  last_name: string;
  marital_status: string;
  phone: string;
  status: string;
  zip_code: number;
  created_at: Date;
  updated_at: Date;
}

export interface BrokerDetailsBackEntity {
  id: string;
  profile_image: string;
  phone_number: string;
  user: UserDetailsBackEntity;
}

export interface UserDetailsBackEntity {
  id: string;
  fullname: string;
}
