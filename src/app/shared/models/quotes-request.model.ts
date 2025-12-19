export interface QuoteRequestModel {
  id: string;
  request_type: string;
  request_status: string;
  email_to_notify: string;
  payment_method: string;
  created_at: Date;
  updated_at: Date;
  client: any; // ???
  broker_agent: any; //???
  request?: AutoInfoModel;
  payment_frequency: string;
}

export interface QuoteRequestResponseModel {
  id: string;
  action_type: string;
  sequential_identifier: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  account_id: string;
  broker_id: string;
  object_of_insurance: string;
  value: number;
  url: string;
  request_type: string;
  location: string;
  delete_at: Date | null;
  customer_request_link?: string;
}

export interface QuoteRequestDeleteAfter {
  id: string;
  account: { name: string };
  application: string;
  request_status: string;
  request_type: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  account_id: string;
  broker_id: string;
  object_of_insurance: string;
  value: number;
  url: string;
  location: string;
  delete_at: Date | null;
}

export interface ClientQuoteRequestModel {
  id: string;
  account: string;
  agent: string;
  request_type: string;
  created_at: Date;
  object_to_insure: string;
  value: number;
  request_location: string;
  request_status: string;
}

// export interface QuoteRequestModel {
//   id: string;
//   sequential_identifier: number;
//   request_type: string;
//   request_status: string;
//   email_to_notify: string;
//   payment_method: string;
//   created_at: Date;
//   updated_at: Date;
//   client: string; // Assuming this is an ID
//   broker_agent: string | null; // Assuming this can be null
//   request: string; // Assuming this is an ID of the AutoInfoModel
//   payment_frequency: string;
// }

export interface AutoInfoModel {
  id: string;
  fullname: string;
  dob: Date;
  genre: string;
  civil_state: string;
  country: string;
  full_address: string;
  zipcode: string;
  created_at: Date;
  updated_at: Date;
  accidents?: any;
  violations?: any;
  brand: string;
  model: string;
  year_manufacture: number;
  driving_license: string;
  year_mileage: number;
  annual_mileage: number;
  additional_drivers: boolean;
  additional_drivers_name: string[];
  year_last_insurance: number;
  company_claims: string;
  mechanisms?: any;
  defensive_driving_courses?: any;
  coverage_type: string;
  person_limit: number;
  accident_limit: number;
  coverage_property_damage_limit: number;
  collision_coverage: boolean;
  deductible_amount: number;
  rental_coverage: boolean;
  daily_limit: number;
  roadside_asistence: boolean;
  limit_per_event: number;
  pip_coverage: boolean;
  pip_coverage_limit: number;
  email?: string;
}
