export interface InsuranceCompanyModel {
  id: string;
  insurerCustomName: string;
  name: string;
  email: string;
  phones: string;
  fax: string;
  direction: string;
  status: string;
  businessLine: string[];
  createdAt: Date;
  updatedAt: Date;
}
