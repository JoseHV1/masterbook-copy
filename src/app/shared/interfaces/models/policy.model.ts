import { PolicyCategoryEnum } from '../../enums/policy-category.enum';
import { PolicyStatus } from '../../enums/policy-status.enum';
import { PolicyTypeEnum } from '../../enums/policy-type.enum';
import { PopulatedAccount } from './accounts.model';
import { PopulatedBrokerModel } from './broker.model';
import { FileInfoModel } from './file-info.model';
import { InsurerModel } from './insurer.model';
import { PolicyTypeModel } from './policy-type.model';

export interface PolicyModel {
  _id: string;
  deletedAt?: Date;
  serial: string;
  quote_id?: string;
  client_id: string;
  agent_id: string;
  agency_id: string;
  refered_policy_id?: string;
  insurance_company_id: string;
  business_line_id: string;
  policy_number: string;
  insure_object: string;
  description: string;
  type: PolicyTypeEnum;
  category: PolicyCategoryEnum;
  start_date: Date;
  end_date: Date;
  prime_amount: number;
  has_payment?: string;
  coverage: number;
  deductible: number;
  document: FileInfoModel;
  request_documents: FileInfoModel[];
  status: PolicyStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedPolicyModel extends PolicyModel {
  client?: PopulatedAccount;
  agent?: PopulatedBrokerModel;
  policy_type?: PolicyTypeModel;
  insurer?: InsurerModel;
  refered_policy?: PolicyModel;
}
