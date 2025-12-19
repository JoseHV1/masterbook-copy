import { FormControl } from '@angular/forms';
import {
  EstructuredBusinessLineModel,
  FormEstructuredBusinessLineModel,
} from './business-line.model';

export interface PolicyCategoryModel {
  _id: string;
  name: string;
  description: string;
  business_lines_id: string[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface EstructuredPolicyCategoryModel extends PolicyCategoryModel {
  business_lines: EstructuredBusinessLineModel[];
}

export interface FormEstructuredPolicyCategoryModel
  extends PolicyCategoryModel {
  business_lines: FormEstructuredBusinessLineModel[];
  control_new_business: FormControl;
  control_renewal: FormControl;
}
