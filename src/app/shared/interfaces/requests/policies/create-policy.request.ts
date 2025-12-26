import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { PolicyStatus } from 'src/app/shared/enums/policy-status.enum';
import { FileInfoModel } from '../../models/file-info.model';

export interface CreatePolicyRequest {
  quote_id: string;
  client_id: string;
  insurer_id: string;
  policy_number: string;
  description: string;
  category: PolicyCategoryEnum;
  policy_type_id: string;
  endorsement_ids: string[];
  refered_policy_id?: string;
  prime_amount: number;
  insure_object: string;
  coverage: number;
  deductible: number;
  document: FileInfoModel;
  request_documents: FileInfoModel[];
  start_date: Date;
  end_date: Date;
  status: PolicyStatus;
  agent_id?: string;
}
