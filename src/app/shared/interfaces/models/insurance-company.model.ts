import { InsuranceCompanyStatus } from '../../enums/insurance-company-status.enum';

export interface InsuranceCompanyModel {
  _id: string;
  name: string;
  logo_url?: string;
  website?: string;
  phone_number?: string;
  email?: string;
  fax?: string;
  address: string;
  status: InsuranceCompanyStatus;
  business_lines: any[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
