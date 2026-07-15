import { TenantStatusEnum } from '../../enums/tenant-status.enum';
import { DocumentLanguageEnum } from '../../enums/document-language.enum';
import { CurrencySymbolPositionEnum } from '../../enums/currency-symbol-position.enum';
import { CountryCodeEnum } from '../../enums/country-code.enum';

export interface TenantModel {
  _id: string;
  serial: string;

  // Datos básicos
  name: string;
  code: CountryCodeEnum;
  status: TenantStatusEnum;
  is_primary: boolean;

  // Locale
  timezone: string;
  document_language: DocumentLanguageEnum;
  date_format: string;
  time_format: '12h' | '24h';

  // Moneda
  currency_code: string;
  currency_symbol: string;
  currency_symbol_position: CurrencySymbolPositionEnum;
  currency_decimal_places: number;
  currency_thousands_separator: string;
  currency_decimal_separator: string;
  stripe_account_id: string | null;

  // Stripe Pricing
  price_agency: string;
  price_master_user: string;
  price_regular_user: string;
  url_success: string;
  url_cancel: string;

  // Módulos
  survey_url: string | null;
  accounts_template_url: string | null;
  policies_template_url: string | null;
  s3_folder_key: string | null;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
