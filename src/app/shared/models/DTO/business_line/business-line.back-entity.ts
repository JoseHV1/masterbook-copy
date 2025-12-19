export interface BusinessLineBackendEntity {
  id: string;
  name: string;
  description: string;
  active: boolean;
  image?: string | null;
  created_at: string;
  updated_at: string;
}
