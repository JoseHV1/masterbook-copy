export interface QuoteCardModel {
  id: number;
  insurance_company: string;
  policy_price: number;
  coverage: number;
  deductible: number;
  attached_documents?: any[];
}
