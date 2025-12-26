export interface UserModel {
  id: string;
  name: string;
  last_name: string;
  email: string;
  roles: string[];
  birthday: string | null;
  gender: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  archived_at: string | null;
  reset_password_code: string | null;
  reset_password_code_expired_at: string | null;
  broker: string | null;
  insureds: any[]; // Assuming you may have a specific type for insureds, replace `any` with that type
  account: any | null; // Replace `any` with a specific type if known
  agency: any | null; // Replace `any` with a specific type if known
  broker_referrer: any | null; // Replace `any` with a specific type if known
  fullname: string;
}
