import { CommmissionConfigTypeEnum } from 'src/app/shared/enums/commission-config-type.enum';

export interface ConfigInsurerRequest {
  commission_configs: CreateCommissionConfigFromInsurerRequest[];
}

export interface CreateCommissionConfigFromInsurerRequest {
  policy_type_id: string;
  commission_percentage: number;
  type: CommmissionConfigTypeEnum;
}
