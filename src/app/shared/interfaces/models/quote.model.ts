import { QuoteStatusEnum } from '../../enums/quote-status.enum';
import { AgencyModel } from './agency.model';
import { InsuranceCompanyModel } from './insurance-company.model';
import { PopulatedRequestModel } from './request.model';

export interface QuoteModel {
  _id: string;
  serial: string;
  request_id: string;
  insurer_id: string;
  agency_id: string;
  prime_amount: number;
  coverage: number;
  deductible: number;
  document: string;
  quote_date: Date;
  status: QuoteStatusEnum;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PopulatedQuoteModel extends QuoteModel {
  request?: PopulatedRequestModel;
  insurer?: InsuranceCompanyModel;
  agency?: AgencyModel;
}
