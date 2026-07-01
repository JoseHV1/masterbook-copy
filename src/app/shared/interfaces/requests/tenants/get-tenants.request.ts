import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

export interface GetTenantsRequest {
  page: number;
  limit: number;
  search?: string;
  status?: TenantStatusEnum;
}
