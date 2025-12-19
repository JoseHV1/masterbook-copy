import { FileInfoModel } from './file-info.model';
import { FormStatusEnum } from '../../enums/form-status.enum';
import { InsurerModel } from './insurer.model';

export interface FormModel {
  _id: string;
  serial: string;
  agency_id: string;
  policy_type_id: string;
  insurer_ids: string;
  name: string;
  form_document: FileInfoModel;
  status: FormStatusEnum;
  deletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedFormModel extends FormModel {
  insurers: InsurerModel[];
}
