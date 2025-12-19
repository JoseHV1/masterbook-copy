export interface QuotesModel {
  id: string;
  insuranceType: string;
  createdAt: Date;
  updatedAt: Date;
  policyPrime: string;
  coverageAmount: string;
  deductible: string;
  url: string;
  status: string;
  requestId?: string;
  dateQuote?: Date;
  account?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}
