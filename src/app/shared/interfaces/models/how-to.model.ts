export interface HowToModel {
  _id: string;
  serial: string;
  title: string;
  description?: string;
  video: string;
  order: number;
  tenant_ids?: string[];
  tenants?: {
    _id: string;
    name: string;
    code: string;
    order?: number;
    status?: 'ACTIVE' | 'INACTIVE';
  }[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
