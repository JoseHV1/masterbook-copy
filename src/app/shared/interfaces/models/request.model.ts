import { PolicyCategoryEnum } from '../../enums/policy-category.enum';
import { RequestStatusEnum } from '../../enums/request-status.enum';
import { PopulatedAccount } from './accounts.model';
import { AddressInfoModel } from './address-info.model';
import { FileInfoModel } from './file-info.model';
import { PopulatedPolicyTypeModel } from './policy-type.model';

export interface RequestModel {
  _id: string;
  agency_id: string;
  client_id: string;
  policy_type_id: string;
  endorsement_ids: string[];
  selected_quote_id?: string;
  refered_policy_id?: string;
  serial: string;
  address_info: AddressInfoModel;
  category: PolicyCategoryEnum;
  status: RequestStatusEnum;
  insure_object: string;
  coverage: number;
  request_documents: FileInfoModel[];
  additional_info?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  rejection_reason: string;
}

export interface PopulatedRequestModel extends RequestModel {
  client?: PopulatedAccount;
  policy_type: PopulatedPolicyTypeModel;
}
