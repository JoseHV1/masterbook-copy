import { FormControl } from '@angular/forms';
import {
  FormPopulatedPolicyTypeModel,
  PopulatedPolicyTypeModel,
} from './policy-type.model';

export interface BusinessLineModel {
  _id: string;
  deletedAt?: Date;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EstructuredBusinessLineModel extends BusinessLineModel {
  policy_types: PopulatedPolicyTypeModel[];
}

export interface FormEstructuredBusinessLineModel extends BusinessLineModel {
  policy_types: FormPopulatedPolicyTypeModel[];
  control_new_business: FormControl;
  control_renewal: FormControl;
}
