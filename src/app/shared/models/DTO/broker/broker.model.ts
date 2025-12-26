import { AddressModel } from '../address/address.model';
import { AgencyModel } from '../agency/agency.model';
import { HiredModel } from '../hired/hired.model';

export interface BrokerModel {
  id: string;
  licenseNumber: string;
  licenseNumberExpires?: Date;
  logo?: string;
  profileImage?: string;
  checkBrandPublication: boolean;
  phoneNumber: string;
  address?: string;
  addressExtra?: AddressModel;
  position: string;
  createdAt: Date;
  updatedAt: Date;
  businessLines: string[];
  user: string;
  agency?: AgencyModel;
  hired?: any; //por definir
}
