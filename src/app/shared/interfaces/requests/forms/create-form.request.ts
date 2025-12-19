import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { RequestType } from 'src/app/shared/enums/request-type.enum';
import { FileInfoModel } from '../../models/file-info.model';

export interface CreateFormRequest {
  name: string;
  business_line_id?: string;
  request_type?: RequestType;
  category: PolicyCategoryEnum;
  form_document: FileInfoModel;
}
