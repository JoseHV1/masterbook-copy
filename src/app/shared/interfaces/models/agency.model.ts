import { PAYMENT_STATUS } from '../../enums/payment-status';

export interface AgencyModel {
  _id: string;
  deletedAt: string | null;
  serial: string;
  name: string;
  phone_number: string;
  logo_url: string | null;
  staff_size: number;
  check_branding: boolean;
  payment_status: PAYMENT_STATUS;
  createdAt: string;
  updatedAt: string;
  __v: number;
  owner_id: any; //TODO MEJORAR EL TIPADO
  retentions: number;
  taxes: number;
}
