import { FileInfoRequest } from '../common/file-info.request';

export interface UpdateHowToRequest {
  title: string;
  description?: string;
  request_documents: FileInfoRequest;
}
