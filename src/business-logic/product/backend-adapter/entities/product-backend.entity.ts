import { CrmPermitBackendEntity } from './crm-permit-backend.entity';

export interface ProductBackendEntity {
  //amount: string;
  created_at?: string;
  crm_permits: CrmPermitBackendEntity[];
  description: string;
  id: string;
  id_stripe: string;
  name: string;
  quantity?: number;
  status: string;
  time_quantity?: number;
  time_type?: string;
  type: string;
  updated_at?: string;
}
