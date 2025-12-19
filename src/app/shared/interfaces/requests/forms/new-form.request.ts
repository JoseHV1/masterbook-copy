import { RequestType } from 'src/app/shared/enums/request-type.enum';
import { FileInfoModel } from '../../models/file-info.model';

export interface NewFormRequest {
  name: string;
  policy_type_id: string;
  insurer_id: RequestType;
  form_document: FileInfoModel;
}
