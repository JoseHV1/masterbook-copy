export interface UploadFileRequest {
  file_name: string;
  file_base64: string;
  entity: string;
  insurers?: { id: string; custom_name: string }[]; //TODO solo aplica para el importador masivo de polizas
}
