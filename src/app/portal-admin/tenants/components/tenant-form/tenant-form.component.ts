import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { CreateTenantRequest } from 'src/app/shared/interfaces/requests/tenants/create-tenant.request';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { DocumentLanguageEnum } from 'src/app/shared/enums/document-language.enum';
import { CurrencySymbolPositionEnum } from 'src/app/shared/enums/currency-symbol-position.enum';
import { CountryCodeEnum } from 'src/app/shared/enums/country-code.enum';
import { UploadFileService } from 'src/app/shared/services/upload_file.service';

@Component({
  selector: 'app-tenant-form',
  templateUrl: './tenant-form.component.html',
  styleUrls: ['./tenant-form.component.scss'],
})
export class TenantFormComponent implements OnInit, OnDestroy {
  @Input() tenant: TenantModel | null = null;
  @Output() formSubmit = new EventEmitter<CreateTenantRequest>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  private _destroy$ = new Subject<void>();

  accountsTemplateFile: { base64: string; name: string } | null = null;
  policiesTemplateFile: { base64: string; name: string } | null = null;
  accountsTemplateCurrentUrl: string | null = null;
  policiesTemplateCurrentUrl: string | null = null;

  statusOptions = [
    { name: '', code: TenantStatusEnum.ACTIVE },
    { name: '', code: TenantStatusEnum.INACTIVE },
  ];

  languageOptions = [
    { name: 'Español (ES)', code: DocumentLanguageEnum.ES },
    { name: 'English (EN)', code: DocumentLanguageEnum.EN },
  ];

  symbolPositionOptions = [
    { name: '', code: CurrencySymbolPositionEnum.BEFORE },
    { name: '', code: CurrencySymbolPositionEnum.AFTER },
  ];

  dateFormatOptions = [
    { name: '', code: 'DD/MM/YYYY' },
    { name: '', code: 'MM/DD/YYYY' },
  ];

  timeFormatOptions = [
    { name: '', code: '24h' },
    { name: '', code: '12h' },
  ];

  timezoneOptions = Intl.supportedValuesOf('timeZone').map(tz => ({ name: tz, code: tz }));

  readonly thousandsSepOptions = [
    { name: '. (1.000.000)',  code: '.' },
    { name: ', (1,000,000)', code: ',' },
    { name: "' (1'000'000)", code: "'" },
    { name: '  (1 000 000)', code: ' ' },
  ];

  readonly decimalSepOptions = [
    { name: ', (1,50)', code: ',' },
    { name: '. (1.50)', code: '.' },
  ];

  // Coincide con el comportamiento por defecto de @IsUrl() en el backend (class-validator):
  // protocolo opcional, dominio con al menos un punto (TLD requerido).
  private readonly _urlPattern = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+([\w\-._~:/?#[\]@!$&'()*+,;=.]*)?$/;

  private readonly _decimalForThousands: Record<string, string> = {
    '.': ',',
    ',': '.',
    "'": '.',
    ' ': '.',
  };

  private _currencyData = (() => {
    const codes = [
      'AED','AFN','ALL','AMD','ANG','AOA','ARS','AUD','AWG','AZN',
      'BAM','BBD','BDT','BGN','BHD','BIF','BMD','BND','BOB','BRL','BSD','BTN','BWP','BYN','BZD',
      'CAD','CDF','CHF','CLP','CNY','COP','CRC','CUP','CVE','CZK',
      'DJF','DKK','DOP','DZD',
      'EGP','ERN','ETB','EUR',
      'FJD','FKP',
      'GBP','GEL','GHS','GIP','GMD','GNF','GTQ','GYD',
      'HKD','HNL','HTG','HUF',
      'IDR','ILS','INR','IQD','IRR','ISK',
      'JMD','JOD','JPY',
      'KES','KGS','KHR','KMF','KRW','KWD','KYD','KZT',
      'LAK','LBP','LKR','LRD','LSL','LYD',
      'MAD','MDL','MGA','MKD','MMK','MNT','MOP','MRU','MUR','MVR','MWK','MXN','MYR','MZN',
      'NAD','NGN','NIO','NOK','NPR','NZD',
      'OMR',
      'PAB','PEN','PGK','PHP','PKR','PLN','PYG',
      'QAR',
      'RON','RSD','RUB','RWF',
      'SAR','SBD','SCR','SDG','SEK','SGD','SHP','SOS','SRD','SSP','STN','SYP','SZL',
      'THB','TJS','TMT','TND','TOP','TRY','TTD','TWD','TZS',
      'UAH','UGX','USD','UYU','UZS',
      'VES','VND','VUV',
      'WST',
      'XAF','XCD','XOF','XPF',
      'YER',
      'ZAR','ZMW','ZWL',
    ];
    const display = new Intl.DisplayNames(['en'], { type: 'currency' });
    return codes.map(code => {
      let symbol = code;
      try {
        const parts = new Intl.NumberFormat('en', {
          style: 'currency', currency: code,
          currencyDisplay: 'narrowSymbol',
          minimumFractionDigits: 0, maximumFractionDigits: 0,
        }).formatToParts(1);
        symbol = parts.find(p => p.type === 'currency')?.value ?? code;
      } catch { /* use code as fallback */ }
      let label = code;
      try { label = display.of(code) ?? code; } catch { /* keep code */ }
      return { name: `${label} (${code})`, code, symbol };
    }).sort((a, b) => a.name.localeCompare(b.name));
  })();

  currencyOptions = this._currencyData.map(({ name, code }) => ({ name, code }));

  countryOptions = (() => {
    const display = new Intl.DisplayNames(['en'], { type: 'region' });
    return Object.values(CountryCodeEnum)
      .map(c => {
        let label: string = c;
        try { label = display.of(c) ?? c; } catch { /* keep code as fallback */ }
        return { name: `${label} (${c})`, code: c };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  })();

  constructor(
    private _fb: FormBuilder,
    private _t: TranslateService,
    private _uploadFile: UploadFileService,
  ) {}

  ngOnInit(): void {
    this._t.get([
      'PORTAL.COMMON.ENABLED',
      'PORTAL.COMMON.DISABLED',
      'PORTAL.TENANTS.SYMBOL_POSITION_BEFORE',
      'PORTAL.TENANTS.SYMBOL_POSITION_AFTER',
      'PORTAL.TENANTS.DATE_FORMAT_LATAM',
      'PORTAL.TENANTS.DATE_FORMAT_USA',
      'PORTAL.TENANTS.TIME_FORMAT_24H',
      'PORTAL.TENANTS.TIME_FORMAT_12H',
    ]).pipe(takeUntil(this._destroy$)).subscribe(t => {
      this.statusOptions = [
        { name: t['PORTAL.COMMON.ENABLED'],  code: TenantStatusEnum.ACTIVE },
        { name: t['PORTAL.COMMON.DISABLED'], code: TenantStatusEnum.INACTIVE },
      ];
      this.symbolPositionOptions = [
        { name: t['PORTAL.TENANTS.SYMBOL_POSITION_BEFORE'], code: CurrencySymbolPositionEnum.BEFORE },
        { name: t['PORTAL.TENANTS.SYMBOL_POSITION_AFTER'],  code: CurrencySymbolPositionEnum.AFTER },
      ];
      this.dateFormatOptions = [
        { name: t['PORTAL.TENANTS.DATE_FORMAT_LATAM'], code: 'DD/MM/YYYY' },
        { name: t['PORTAL.TENANTS.DATE_FORMAT_USA'],   code: 'MM/DD/YYYY' },
      ];
      this.timeFormatOptions = [
        { name: t['PORTAL.TENANTS.TIME_FORMAT_24H'], code: '24h' },
        { name: t['PORTAL.TENANTS.TIME_FORMAT_12H'], code: '12h' },
      ];
    });
    this._buildForm();
    if (this.tenant) this._patchForm(this.tenant);

    this.form.get('currency_code')!.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(code => {
        const found = this._currencyData.find(c => c.code === code);
        if (found) {
          this.form.get('currency_symbol')?.setValue(found.symbol, { emitEvent: false });
        }
      });

    this.form.get('currency_thousands_separator')!.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(sep => {
        const decimal = this._decimalForThousands[sep];
        if (decimal) {
          this.form.get('currency_decimal_separator')?.setValue(decimal, { emitEvent: false });
        }
      });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _buildForm(): void {
    this.form = this._fb.group({
      name:       [null, [Validators.required]],
      code:       [null, [Validators.required]],
      status:     [TenantStatusEnum.ACTIVE, [Validators.required]],
      is_primary: [false],

      timezone:    [null, [Validators.required]],
      language:    [DocumentLanguageEnum.ES, [Validators.required]],
      date_format: ['DD/MM/YYYY', [Validators.required]],
      time_format: ['24h', [Validators.required]],

      currency_code:                [null, [Validators.required]],
      currency_symbol:              [null, [Validators.required]],
      currency_symbol_position:     [CurrencySymbolPositionEnum.BEFORE, [Validators.required]],
      currency_decimal_places:      [2,    [Validators.required, Validators.min(0), Validators.max(4)]],
      currency_thousands_separator: [null, [Validators.required]],
      currency_decimal_separator:   [null, [Validators.required]],
      stripe_account_id:            [null],
      admin_email:                  [null, [Validators.email]],

      price_agency:      [null],
      price_master_user: [null],
      price_regular_user:[null],
      url_success:       [null],
      url_cancel:        [null],

      survey_url: [null, [Validators.pattern(this._urlPattern)]],
    });
  }

  private _patchForm(tenant: TenantModel): void {
    this.form.patchValue({
      name:       tenant.name,
      code:       tenant.code,
      status:     tenant.status,
      is_primary: tenant.is_primary,

      timezone:    tenant.timezone,
      language:    tenant.document_language,
      date_format: tenant.date_format,
      time_format: tenant.time_format ?? '24h',

      currency_code:                tenant.currency_code,
      currency_symbol:              tenant.currency_symbol,
      currency_symbol_position:     tenant.currency_symbol_position,
      currency_decimal_places:      tenant.currency_decimal_places,
      currency_thousands_separator: tenant.currency_thousands_separator,
      currency_decimal_separator:   tenant.currency_decimal_separator,
      stripe_account_id:            tenant.stripe_account_id,
      admin_email:                  tenant.admin_email ?? null,

      price_agency:       tenant.price_agency,
      price_master_user:  tenant.price_master_user,
      price_regular_user: tenant.price_regular_user,
      url_success:        tenant.url_success,
      url_cancel:         tenant.url_cancel,

      survey_url: tenant.survey_url,
    });

    this.accountsTemplateCurrentUrl = tenant.accounts_template_url ?? null;
    this.policiesTemplateCurrentUrl = tenant.policies_template_url ?? null;
  }

  onFileSelected(event: Event, type: 'accounts' | 'policies'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    input.value = '';

    const reader = new FileReader();
    reader.onload = () => {
      const entry = { base64: reader.result as string, name: file.name };
      if (type === 'accounts') {
        this.accountsTemplateFile = entry;
        this.accountsTemplateCurrentUrl = null;
      } else {
        this.policiesTemplateFile = entry;
        this.policiesTemplateCurrentUrl = null;
      }
    };
    reader.readAsDataURL(file);
  }

  clearTemplate(type: 'accounts' | 'policies'): void {
    if (type === 'accounts') {
      this.accountsTemplateFile = null;
      this.accountsTemplateCurrentUrl = null;
    } else {
      this.policiesTemplateFile = null;
      this.policiesTemplateCurrentUrl = null;
    }
  }

  downloadTemplate(type: 'accounts' | 'policies'): void {
    const url = type === 'accounts'
      ? this.accountsTemplateCurrentUrl
      : this.policiesTemplateCurrentUrl;
    if (!url) return;
    this._uploadFile.getUrlFile(url)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: presigned => window.open(presigned, '_blank') });
  }

  getDisplayName(type: 'accounts' | 'policies'): string | null {
    const pending = type === 'accounts' ? this.accountsTemplateFile : this.policiesTemplateFile;
    if (pending) return pending.name;
    const key = type === 'accounts' ? this.accountsTemplateCurrentUrl : this.policiesTemplateCurrentUrl;
    if (key) return key.split('/').pop()?.split('?')[0] ?? null;
    return null;
  }

  hasExistingFile(type: 'accounts' | 'policies'): boolean {
    return !!(type === 'accounts' ? this.accountsTemplateCurrentUrl : this.policiesTemplateCurrentUrl);
  }

  submit(): void {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }
    const { language, survey_url, ...raw } = this.form.getRawValue();
    this.formSubmit.emit({
      ...raw,
      document_language: language,
      survey_url:        survey_url || undefined,
      currency_decimal_places: Number(raw.currency_decimal_places),
      accounts_template_file:  this.accountsTemplateFile?.base64 ?? undefined,
      policies_template_file:  this.policiesTemplateFile?.base64 ?? undefined,
    });
  }

  isInvalid(field: string): boolean {
    const c = this.form.get(field);
    return !!(c?.invalid && c?.touched);
  }
}
