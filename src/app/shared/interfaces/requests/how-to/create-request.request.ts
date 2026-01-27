import { FileInfoRequest } from '../common/file-info.request';

export interface CreateHowToRequest {
  title: string;
  description?: string;
  request_documents: FileInfoRequest;
}
