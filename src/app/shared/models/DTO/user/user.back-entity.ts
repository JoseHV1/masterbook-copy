import { BrokerRefererBackEntity } from '../broker-referer/broker-referer.back-entity';
import { BrokerBackendEntity } from '../broker/broker.back-entity';

export interface UserBackendEntity {
  id: string;
  name: string;
  last_name: string;
  email: string;
  roles: string[];
  birthday?: string;
  gender?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  archived_at?: string;
  reset_password_code?: string;
  reset_password_code_expired_at?: string;
  agency?: string;
  broker?: BrokerBackendEntity;
  insureds: any[]; //por definir
  account?: string;
  broker_referrer?: BrokerRefererBackEntity;
  fullname: string;
  session_id: string;
}

export interface UserByOwnerBackendEntity {
  name: string;
  last_name: string;
  email: string;
  birthday: Date;
  rol: string;
  gender: string;
  license_number: string;
  license_expiry_date: Date;
  business_line: string;
  phone_number: string;
}
