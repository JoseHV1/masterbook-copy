export interface TenantStatusItem {
  tenant_id: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CreateHowToRequest {
  title: string;
  description?: string;
  video: string;
  tenant_ids?: string[];
  tenant_statuses?: TenantStatusItem[];
}
