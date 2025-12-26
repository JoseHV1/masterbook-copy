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
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
