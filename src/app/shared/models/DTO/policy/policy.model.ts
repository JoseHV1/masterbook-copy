export interface PolicyModel {
  accountId: string;
  actionType: string;
  coverage: number;
  deductible: number;
  details: string;
  efectiveDate: string;
  expirationDate: string;
  insuranceCompany: string;
  pending: boolean;
  policyCopy: string;
  policyNumber: string;
  policyPrime: number;
  renewalDocument: string;
  requestForm: string;
  requestId?: string;
  status: string;
}
