import { FormGroup } from '@angular/forms';
import { ProductTypeEnum } from '../../enums/product-type.enum';
import { BusinessLineModel } from './business-line.model';
import { PolicyCategoryModel } from './policy-category.model';

export interface PolicyTypeModel {
  _id: string;
  policy_category_id: string;
  name: string;
  naic_code: string;
  type: ProductTypeEnum;
  description: string;
  icon?: string;
  business_line_id: string;
  count_forms: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface PopulatedPolicyTypeModel extends PolicyTypeModel {
  business_line: BusinessLineModel;
  policy_category: PolicyCategoryModel;
}

export interface FormPopulatedPolicyTypeModel extends PopulatedPolicyTypeModel {
  form: FormGroup;
}
