import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { RequestType } from 'src/app/shared/enums/request-type.enum';
import { AddressInfoRequest } from '../common/address-info.request';

export interface CreateRequestRequest {
  client_id?: string;
  policy_type_id: string;
  endorsement_ids?: string[];
  refered_policy_id?: string;
  category: PolicyCategoryEnum;
  business_line_id?: string;
  insure_object: string;
  coverage: number;
  request_documents: any[];
  additional_info?: string;
  address_info?: AddressInfoRequest;
}
