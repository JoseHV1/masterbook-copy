import { CommissionConfigStatusEnum } from '../../enums/commission-config-status.enum';
import { CommmissionConfigTypeEnum } from '../../enums/commission-config-type.enum';

export interface CommissionConfigModel {
  _id: string;
  deletedAt?: Date;
  agency_id: string;
  created_by: string;
  insurer_id: string;
  policy_type_id: string;
  commission_percentage: number;
  type: CommmissionConfigTypeEnum;
  status: CommissionConfigStatusEnum;
  createdAt?: Date;
  updatedAt?: Date;
  __v: number;
}
