import { BrokerRefererModel } from '../broker-referer/broker-referer.model';
import { BrokerModel } from '../broker/broker.model';

export interface UserModel {
  id: string;
  name: string;
  lastName: string;
  email: string;
  roles: RolesEnum[];
  birthday?: Date;
  gender?: string;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  archivedAt?: Date;
  resetPasswordCode?: string;
  resetPasswordCodeExpiredAt?: Date;
  agency?: string;
  broker?: BrokerModel;
  insureds: any[]; //por definir
  account?: string;
  brokerReferrer?: BrokerRefererModel;
  fullName: string;
  sessionId: string;
}

export enum RolesEnum {
  USER = 'user',
  AGENCY_OWNER = 'agency-owner',
  AGENCY_BROKER = 'agency-broker',
  AGENCY_ADMINISTRATOR = 'agency-administrator',
  INSURED = 'insured',
  INDEPENDIENT_BROKER = 'independient-broker',
  SUPER_ADMIN = 'super-admin',
}
