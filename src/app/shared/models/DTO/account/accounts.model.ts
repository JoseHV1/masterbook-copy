export interface AccountsModel {
  id: string;
  account_custom_id: string;
  account_name: string;
  additional_address_information: string;
  address: string;
  agency_id: string;
  birth_date: Date;
  broker: BrokerDetailsModel;
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

export interface ListAccountsModel {
  id: string;
  account_custom_id: string;
  account_name: string;
  additional_address_information: string;
  address: string;
  agency_id: string;
  birth_date: Date;
  broker: {
    id: string;
    profile_image: string | null;
    phone_number: string;
    user: {
      id: string;
      fullname: string;
    };
  };
  email: string;
  extension: Number;
  first_name: string;
  gender: string;
  identification_number: Number;
  last_name: string;
  marital_status: string;
  phone: string;
  status: string;
  zip_code: Number;
  created_at: Date;
  updated_at: Date;
}

export interface BrokerDetailsModel {
  id: string;
  profile_image: string;
  phone_number: string;
  user: UserDetailsModel;
}

export interface UserDetailsModel {
  id: string;
  fullname: string;
}
