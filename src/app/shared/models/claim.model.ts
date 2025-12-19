import { BaseModel } from '../interfaces/models/base.model';
import { ClaimStatusEnum } from '../enums/claim-status.enum';

export interface ClaimModel extends BaseModel {
  serial: string;
  agency_id: string;
  broker_id: string;
  client_id: string;
  policy_id: string;
  insurance_company_id: string;
  amount_requested: number;
  remaining_balance: string;
  event_date: Date;
  location: string;
  status: ClaimStatusEnum;
  attachments: object;
  description: string;
}
