import { QuoteStatusEnum } from 'src/app/shared/enums/quote-status.enum';

export interface UpdateQuoteStatusRequest {
  quote_id: string;
  status: QuoteStatusEnum;
}
