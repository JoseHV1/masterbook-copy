import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { finalize, Observable, Subject, takeUntil, tap } from 'rxjs';
import { fileUploadMode } from 'src/core/cdk/file-upload/file-upload.component';
import { UiService } from 'src/app/shared/services/ui.service';
import { ConfiguredInsurerAsyncValidator } from '@app/shared/helpers/configured-insurer.validator';
import { CoverageMinValidator } from '@app/shared/helpers/coverage-min.validator';
import { hasError } from '@app/shared/helpers/has-error.helper';
import { InsurerService } from '@app/shared/services/insurer.service';
import { PolicyCategoryEnum } from '@app/shared/enums/policy-category.enum';
import { DatasetsService } from '@app/shared/services/dataset.service';
import { InsuranceCompanyModel } from 'src/app/shared/interfaces/models/insurance-company.model';
import { PopulatedRequestModel } from '@app/shared/interfaces/models/request.model';
import { CreateQuoteRequest } from '@app/shared/interfaces/requests/quotes/create-quote.request';
import { QuotesService } from '@app/shared/services/quotes.service';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-new-quote',
  templateUrl: './modal-new-quote.component.html',
  styleUrls: ['./modal-new-quote.component.scss'],
})
export class ModalNewQuoteComponent implements OnDestroy {
  request!: PopulatedRequestModel;
  form!: FormGroup;
  fileUploadMode = fileUploadMode;
  insuranceCompaniesItems: any[] = [];
  submitting = false;
  hasError = hasError;

  private _destroy$ = new Subject<void>();

  constructor(
    private _insurer: InsurerService,
    private _ui: UiService,
    private _quotes: QuotesService,
    private dialogRef: MatDialogRef<ModalNewQuoteComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dataModal: { request: PopulatedRequestModel },
    private _dataset: DatasetsService,
    private _t: TranslateService
  ) {
    this.request = dataModal.request;
    this._initData();
  }

  private _initData(): void {
    this._ui.showLoader();
    this._loadInsuranceCompanies().subscribe({
      next: () => {
        this._initQuotesForm();
        this._listenToInsurerChanges();
        this._ui.hideLoader();
      },
      error: () => this._ui.hideLoader(),
    });
  }

  private _initQuotesForm(): void {
    this.form = new FormGroup({
      quote_id: new FormControl({ value: null, disabled: true }),
      insurer_id: new FormControl(
        null,
        [Validators.required],
        [
          ConfiguredInsurerAsyncValidator(
            this._insurer,
            this.request.policy_type_id,
            this._getcomissionCycleType(this.request.category)
          ),
        ]
      ),
      quote_date: new FormControl(null, [Validators.required]),
      prime_amount: new FormControl(null, [Validators.required]),
      coverage: new FormControl(null, [Validators.required, CoverageMinValidator()]),
      deductible: new FormControl(null, [Validators.required]),
      document: new FormControl(null, [Validators.required]),
    });

    this._listenToPrimeAmountChanges();
  }

  private _listenToPrimeAmountChanges(): void {
    const primeControl = this.form.get('prime_amount');
    const coverageControl = this.form.get('coverage');

    if (primeControl && coverageControl) {
      primeControl.valueChanges.pipe(takeUntil(this._destroy$)).subscribe(() => {
        coverageControl.updateValueAndValidity();
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _listenToInsurerChanges(): void {
    const insurerControl = this.form.get('insurer_id');

    if (insurerControl) {
      insurerControl.statusChanges.subscribe(status => {
        if (status === 'INVALID') {
          const errors = insurerControl.errors;

          if (errors && errors['UNCONFIGINSURER']) {
            const selectedInsurer = this.insuranceCompaniesItems.find(
              opt => opt.code === insurerControl.value
            );

            if (selectedInsurer) {
              this._ui
                .showInformationModal({
                  text: this._t.instant('PORTAL.POLICIES.UNCONFIGURED_INSURER_TEXT'),
                  title: this._t.instant('PORTAL.POLICIES.UNCONFIGURED_INSURER_TITLE'),
                  type: UiModalTypeEnum.WARNING,
                  redirectButton: {
                    text: this._t.instant('PORTAL.POLICIES.UNCONFIGURED_INSURER_BUTTON'),
                    url: `/portal/insurer/${selectedInsurer.serial}`,
                  },
                })
                .subscribe(result => {
                  if (result === 'redirect') {
                    this.dialogRef.close(true);
                  }
                });
            }
          }
        }
      });
    }
  }

  private _getcomissionCycleType(policyCategory: PolicyCategoryEnum) {
    if (
      [PolicyCategoryEnum.REINSTALLMENT, PolicyCategoryEnum.RENEWAL].includes(
        policyCategory
      )
    )
      return PolicyCategoryEnum.RENEWAL;
    return PolicyCategoryEnum.NEW_BUSINESS;
  }

  private _loadInsuranceCompanies(): Observable<InsuranceCompanyModel[]> {
    return this._dataset.getInsuranceCompaniesDataset().pipe(
      tap(
        companies =>
          (this.insuranceCompaniesItems = companies.map(item => ({
            code: item._id,
            name: item.name,
            serial: item.serial,
          })))
      )
    );
  }

  close(resp: boolean) {
    this.dialogRef.close(resp);
  }

  createQuote(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.invalid || this.submitting) {
      return;
    }

    this.submitting = true;

    const req: CreateQuoteRequest = {
      ...this.form.value,
      request_id: this.request._id,
    };

    this._ui.showLoader();
    this._quotes
      .createQuote(req)
      .pipe(
        finalize(() => {
          this._ui.hideLoader();
          this.submitting = false;
        })
      )
      .subscribe(() => {
        this._ui.showAlertSuccess(this._t.instant('PORTAL.REQUESTS.QUOTE_CREATED'));
        this.form.reset();
        this.dialogRef.close(true);
      });
  }
}
