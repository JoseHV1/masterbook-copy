import { AccountStatusEnum } from 'src/app/shared/enums/account-status.enum';

export interface SetAccountStatusRequest {
  status: AccountStatusEnum;
}
