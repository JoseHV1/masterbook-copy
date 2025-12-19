export interface SelectedFile {
  weight?: number;
  name: string;
  preview: string | null;
  document?: string;
  extension: string;
  uploaded_at?: Date;
}
