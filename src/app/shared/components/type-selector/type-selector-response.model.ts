import { RequestSubTypes, RequestTypes } from '../../models/request-type.model';

export interface QuoteRequestTypeResponseModel {
  type: RequestTypes;
  subtype: RequestSubTypes;
}
