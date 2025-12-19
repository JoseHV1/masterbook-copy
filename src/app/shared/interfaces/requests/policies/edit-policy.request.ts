import { PolicyStatus } from 'src/app/shared/enums/policy-status.enum';
import { FileInfoModel } from '../../models/file-info.model';

export interface EditPolicyRequest {
  insurer_id: string;
  policy_number: string;
  description: string;
  prime_amount: number;
  coverage: number;
  deductible: number;
  document: FileInfoModel;
  request_documents: FileInfoModel[];
  insure_object: string;
  start_date: Date;
  end_date: Date;
  status: PolicyStatus;
  agent_id?: string;
}
