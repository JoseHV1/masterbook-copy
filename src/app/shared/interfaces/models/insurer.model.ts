import { InsuranceCompanyStatus } from '../../enums/insurance-company-status.enum';

export interface InsurerModel {
  _id: string;
  name: string;
  logo_url?: string;
  serial: string;
  email: string;
  country: string;
  ein: string;
  phone_number: string;
  fax: string;
  status: InsuranceCompanyStatus;
  tenant_ids: string[];
  tenants?: { _id: string; name: string; code: string }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CreateInsurerRequest {
  name: string;
  email?: string;
  country?: string;
  ein?: string;
  phone_number?: string;
  fax?: string;
  logo_url?: string;
  tenant_ids?: string[];
}

export type UpdateInsurerRequest = Partial<CreateInsurerRequest>;
