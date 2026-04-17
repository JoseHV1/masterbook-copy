import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { AddressInfoRequest } from 'src/app/shared/interfaces/requests/common/address-info.request';
import { LeadStatusEnum } from '../enums/lead-status.enum';

export interface LeadModel {
  _id: string;
  serial: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address_info: AddressInfoRequest;
  gender: GenderEnum;
  status: LeadStatusEnum;
  capture_medium?: string;
  other_capture_medium?: string;
  areas_of_interest?: string[];
  notes?: string;
  transferred_at?: Date;
  converted_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}
