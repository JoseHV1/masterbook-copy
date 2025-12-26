import { CrmPermitModel } from './crm-permit.model';

export interface ProductModel {
  //amount: string;
  createdAt?: Date;
  crmPermits: CrmPermitModel[];
  description: string;
  id: string;
  idStripe: string;
  name: string;
  quantity?: number;
  status: string;
  timeQuantity?: number;
  timeType?: string;
  type: string;
  updatedAt?: Date;
}
