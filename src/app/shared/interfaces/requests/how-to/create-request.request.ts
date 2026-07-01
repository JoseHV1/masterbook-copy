export interface CreateHowToRequest {
  title: string;
  description?: string;
  video: string;
  tenant_ids?: string[];
}
