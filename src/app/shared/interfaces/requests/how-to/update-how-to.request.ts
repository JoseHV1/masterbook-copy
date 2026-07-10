import { TenantStatusItem } from './create-request.request';

export interface UpdateHowToRequest {
  title?: string;
  description?: string;
  video?: string;
  tenant_ids?: string[];
  tenant_statuses?: TenantStatusItem[];
  order?: number;
}

export interface MoveHowToOrder {
  order: number;
}

export interface ReorderHowToItem {
  _id: string;
  order: number;
}

export interface ReorderHowToRequest {
  tenant_id?: string;
  items: ReorderHowToItem[];
}
