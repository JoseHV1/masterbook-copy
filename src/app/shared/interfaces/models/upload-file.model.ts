export interface UploadFileModel {
  _id: string;
  deletedAt?: Date;
  entity: string;
  file_name: string;
  file_url: string;
  status: string;
  rows: number;
  rows_erros: number;
  rows_success: number;
  rows_with_errors: any[];
  upload_at: Date;
  upload_for_name: string;
  agency_id: string;
  createdAt: Date;
  updatedAt: Date;
}
