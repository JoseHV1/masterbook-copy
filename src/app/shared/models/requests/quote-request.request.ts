export interface QuoteRequestRequest {
  request_type: string;
  id_account: string;
  fullname: string;
  dob: string;
  genre: string;
  civil_state: string;
  country: string;
  full_address: string;
  zipcode: string; //no esta en diseño pero lo agregue
  email_to_notify: string;
  brand: string;
  model: string;
  year_manufacture: number;
  driving_license: string; // modifique identification number para pedir driving license
  annual_mileage: number;
  year_mileage: number; //no esta en diseño pero lo agregue
  additional_drivers: boolean;
  additional_drivers_name: string[];
  company_claims: string;
  coverage_type: string;
  person_limit: number;
  accident_limit: number;
  limit_per_event: number; // no esta en diseño pero lo agregue
  coverage_property_damage_limit: number;
  collision_coverage: boolean;
  deductible_amount: number;
  rental_coverage: boolean;
  daily_limit: number;
  roadside_asistence: boolean;
  payment_method: string;
  pip_coverage: boolean;
  //no esta en diseño, va quemado
  payment_frequency: string;
  year_last_insurance: number;
  pip_coverage_limit: number;
}
