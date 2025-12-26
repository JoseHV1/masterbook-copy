export interface EmployeeModel {
  id: string;
  license_number: string;
  license_number_expires_on: Date;
  logo: string;
  profile_image: string;
  check_brand_publication: boolean;
  phone_number: string;
  address: string;
  address_extra: any;
  position: string;
  created_at: Date;
  updated_at: Date;
  business_lines_ids: string[];
  user: {
    id: string;
    name: string;
    last_name: string;
    email: string;
    roles: string[];
    email_verified_at: Date | null;
    created_at: Date;
    updated_at: Date;
    archived_at: Date | null;
    gender: string;
    birthday: Date;
    fullname: string;
  };
  agency: any;
  hired: string;
}
