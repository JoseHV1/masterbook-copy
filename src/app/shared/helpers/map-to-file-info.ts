import { FileInfoModel } from '../interfaces/models/file-info.model';

export const mapToFileInfo = (file: string | FileInfoModel) => {
  return typeof file === 'string'
    ? { weight: 1, name: 'Document', extension: 'pdf', document: file }
    : file;
};
