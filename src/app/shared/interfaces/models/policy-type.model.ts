import { FormGroup } from '@angular/forms';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { BusinessLineModel } from './business-line.model';
import { PolicyCategoryModel } from './policy-category.model';

export interface PolicyTypeModel {
  _id: string;
  serial: string;
  policy_category_id: string;
  name: string;
  name_translations?: { es?: string; en?: string };
  naic_code: string;
  type: ProductTypeEnum;
  description: string;
  business_line_id: string;
  count_forms: number;
  tenant_ids?: string[];
  tenants?: { _id: string; name: string; code: string; status?: 'ACTIVE' | 'INACTIVE' }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreatePolicyTypeRequest {
  name: string;
  name_translations?: { es?: string; en?: string };
  naic_code: string;
  type: ProductTypeEnum;
  description?: string;
  business_line_id: string;
  policy_category_id: string;
  tenant_ids?: string[];
  tenant_statuses?: { tenant_id: string; status: 'ACTIVE' | 'INACTIVE' }[];
}

export type UpdatePolicyTypeRequest = Partial<CreatePolicyTypeRequest>;

export interface PopulatedPolicyTypeModel extends PolicyTypeModel {
  business_line: BusinessLineModel;
  policy_category: PolicyCategoryModel;
}

export interface FormPopulatedPolicyTypeModel extends PopulatedPolicyTypeModel {
  form: FormGroup;
}
