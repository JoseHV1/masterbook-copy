import { AddressBackendEntity } from '../address/address.back-entity';
import { AgencyBackendEntity } from '../agency/agency.back-entity';

export interface BrokerBackendEntity {
  id: string;
  license_number: string;
  license_number_expires_on?: string;
  logo?: string;
  profile_image?: string;
  check_brand_publication: boolean;
  phone_number: string;
  address?: string;
  address_extra?: AddressBackendEntity;
  position: string;
  created_at: string;
  updated_at: string;
  business_lines_ids: string[];
  user: string;
  agency?: AgencyBackendEntity;
  hired?: any; //por definir;
}
