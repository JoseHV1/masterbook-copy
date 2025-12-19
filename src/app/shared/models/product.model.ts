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

export interface CrmPermitModel {
  createdAt?: Date;
  id: string;
  name: string;
  status: string;
  updatedAt?: Date;
}
