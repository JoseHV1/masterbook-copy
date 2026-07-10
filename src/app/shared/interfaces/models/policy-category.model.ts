import { FormControl } from '@angular/forms';
import {
  EstructuredBusinessLineModel,
  FormEstructuredBusinessLineModel,
} from './business-line.model';

export interface PolicyCategoryModel {
  _id: string;
  serial: string;
  name: string;
  name_translations?: { es?: string; en?: string };
  description: string;
  business_line_ids: string[];
  business_lines?: { _id: string; name: string }[];
  tenant_ids?: string[];
  tenants?: { _id: string; name: string; code: string; status?: 'ACTIVE' | 'INACTIVE' }[];
  policy_types?: {
    _id: string;
    serial: string;
    name: string;
    name_translations?: { es?: string; en?: string };
    tenants: { _id: string; name: string; code: string; status: 'ACTIVE' | 'INACTIVE' }[];
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreatePolicyCategoryRequest {
  name: string;
  name_translations?: { es?: string; en?: string };
  description?: string;
  business_line_ids: string[];
  tenant_ids?: string[];
  tenant_statuses?: { tenant_id: string; status: 'ACTIVE' | 'INACTIVE' }[];
}

export type UpdatePolicyCategoryRequest = Partial<CreatePolicyCategoryRequest>;

export interface EstructuredPolicyCategoryModel extends PolicyCategoryModel {
  business_lines: EstructuredBusinessLineModel[];
}

export interface FormEstructuredPolicyCategoryModel
  extends PolicyCategoryModel {
  business_lines: FormEstructuredBusinessLineModel[];
  control_new_business: FormControl;
  control_renewal: FormControl;
}
