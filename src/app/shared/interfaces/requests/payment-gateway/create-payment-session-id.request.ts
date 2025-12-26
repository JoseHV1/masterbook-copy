import { PAYABLE_ITEMS } from 'src/app/shared/enums/payable-items.enum';

export interface CreatePaymentSessionIdRequest {
  pay_item: PAYABLE_ITEMS;
}
