import { FormControl } from '@angular/forms';
import {
  FormPopulatedPolicyTypeModel,
  PopulatedPolicyTypeModel,
} from './policy-type.model';

export interface BusinessLineModel {
  _id: string;
  deletedAt?: Date;
  serial?: string;
  name: string;
  name_translations?: { es?: string; en?: string };
  description?: string;
  tenant_ids?: string[];
  tenants?: { _id: string; name: string; code: string; status?: 'ACTIVE' | 'INACTIVE' }[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessLineRequest {
  name: string;
  name_translations?: { es?: string; en?: string };
  description?: string;
  tenant_ids?: string[];
  tenant_statuses?: { tenant_id: string; status: 'ACTIVE' | 'INACTIVE' }[];
}

export type UpdateBusinessLineRequest = Partial<CreateBusinessLineRequest>;

export interface EstructuredBusinessLineModel extends BusinessLineModel {
  policy_types: PopulatedPolicyTypeModel[];
}

export interface FormEstructuredBusinessLineModel extends BusinessLineModel {
  policy_types: FormPopulatedPolicyTypeModel[];
  control_new_business: FormControl;
  control_renewal: FormControl;
}
