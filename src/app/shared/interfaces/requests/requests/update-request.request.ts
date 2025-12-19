import { AddressInfoRequest } from '../common/address-info.request';

export interface UpdateRequestRequest {
  client_id?: string;
  insure_object: string;
  coverage: number;
  request_document: string;
  address_info?: AddressInfoRequest;
  additional_info?: string;
}
