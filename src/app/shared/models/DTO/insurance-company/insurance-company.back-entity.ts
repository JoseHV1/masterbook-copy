export interface InsuranceCompanyBackendEntity {
  id: string;
  insurer_custom_name: string;
  name: string;
  email: string;
  phones: string;
  fax: string;
  direction: string;
  status: string;
  business_line: string[];
  created_at: string;
  updated_at: string;
}
