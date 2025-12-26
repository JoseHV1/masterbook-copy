export interface FilePreviewDataItemModel {
  weight: number;
  name: string;
  preview: string | null;
  document: string;
  extension: string;
  uploaded_at?: string;
}

export interface FilePreviewDataModel {
  files: FilePreviewDataItemModel[];
  selectedIndex: number;
}
