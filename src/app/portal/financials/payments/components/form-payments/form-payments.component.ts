import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormArray,
  AbstractControl,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';
import { isInvalid } from 'src/app/shared/helpers/is-invalid.helper';
import { UiService } from 'src/app/shared/services/ui.service';
import { take, forkJoin, Subject, Observable, merge } from 'rxjs';
import { debounceTime, finalize, map, takeUntil } from 'rxjs/operators';
import { PaymentsService } from 'src/app/shared/services/payments.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { CommissionsService } from 'src/app/shared/services/commissions.service';
import { AgencySettingsService } from 'src/app/shared/services/agency-settings.service';
import { AgencyModel } from 'src/app/shared/interfaces/models/agency.model';
import { CreatePaymentsTransactionsRequest } from 'src/app/shared/interfaces/requests/payments-transactions/create-payments-transactions.request';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PaymentTransactionModel } from 'src/app/shared/models/payment-transaction.model';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { SearchCheckCommissionConfig } from 'src/app/shared/interfaces/models/search-check-commission-config';

@Component({
  selector: 'app-form-payments',
  templateUrl: './form-payments.component.html',
  styleUrls: ['./form-payments.component.scss'],
})
export class FormPaymentsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() payment?: PaymentTransactionModel;

  private $destroy: Subject<void> = new Subject();
  form!: FormGroup;

  agencySettings!: AgencyModel;
  selectedInsuranceId: string = '';
  selectedAccountId: string = '';
  subTotal: number = 0;
  showPaymentApplications: boolean = false;
  lastOpenBalanceValue: number = 0;
  paramsBySearchPolicies!: { param: string; id: string };

  isInvalid = isInvalid;
  hasError = hasError;

  constructor(
    private _payments: PaymentsService,
    private router: Router,
    private authService: AuthService,
    private _invoices: InvoiceService,
    private _commissions: CommissionsService,
    private _agencySettings: AgencySettingsService,
    private _ui: UiService,
    public _url: UrlService
  ) {}

  ngOnInit() {
    this.form = this._payments.getPaymentsForm();
    this.addPaymentApplication();

    this.paymentApplications.valueChanges.subscribe(() => {
      this.lastOpenBalanceValue = this._getLastOpenBalance();
    });

    this._agencySettings
      .getAgencySettings()
      .pipe(takeUntil(this.$destroy))
      .subscribe(resp => {
        this.agencySettings = resp;
        this._listenFormChanges();
        this.updateFormValues();
      });

    this.form.get('payment_from')?.valueChanges.subscribe(val => {
      const accountCtrl = this.form.get('account');
      const insurerCtrl = this.form.get('insurer_company');

      if (val === '1') {
        accountCtrl?.setValidators([Validators.required]);
        insurerCtrl?.clearValidators();

        insurerCtrl?.setValue(null);
        insurerCtrl?.markAsPristine();
        insurerCtrl?.markAsUntouched();
      } else if (val === '2') {
        insurerCtrl?.setValidators([
          Validators.required,
          Validators.maxLength(50),
        ]);
        accountCtrl?.clearValidators();

        accountCtrl?.setValue(null);
        accountCtrl?.markAsPristine();
        accountCtrl?.markAsUntouched();
      }

      accountCtrl?.updateValueAndValidity();
      insurerCtrl?.updateValueAndValidity();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['payment']?.currentValue) return;
    if (!this.form) return;

    const payment = changes['payment'].currentValue;

    this.form.patchValue(
      {
        payment_date: this._formatDateToISODate(payment.payment_date || ''),
        total_amount: payment.total_amount ?? null,
        retentions: payment.retentions ?? null,
        taxes: payment.taxes ?? null,
        check_number: payment.ach_number ?? null,
      },
      { emitEvent: false }
    );

    this.form
      .get('subtotal')
      ?.setValue(payment.subtotal ?? null, { emitEvent: false });
  }

  get paymentApplications(): FormArray {
    return this.form.get('paymentApplications') as FormArray;
  }

  get paymentApplicationsControls(): FormGroup[] {
    return this.paymentApplications.controls as FormGroup[];
  }

  private get agencyId(): string {
    const auth = this.authService.getAuth();
    return auth?.user.agency_id ?? '';
  }

  private _listenFormChanges(): void {
    merge(
      this.form.get('retentions')!.valueChanges,
      this.form.get('taxes')!.valueChanges
    )
      .pipe(debounceTime(0), takeUntil(this.$destroy))
      .subscribe(() => this._recalculateTotals());

    this.form.controls['total_amount']?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => this.updateFormValues());

    this.form.controls['insurer_company']?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(value => {
        this.showPaymentApplications = !!(value && value.name && value.code);
      });

    this.form.controls['account']?.valueChanges
      .pipe(takeUntil(this.$destroy))
      .subscribe(value => {
        this.showPaymentApplications = !!value;
      });
  }

  private updateFormValues(): void {
    const totalAmount = Number(this.form.controls['total_amount']?.value ?? 0);
    if (!this.agencySettings) return;

    const retentionPercent = this.agencySettings.retentions ?? 0;
    const taxPercent = this.agencySettings.taxes ?? 0;

    const newRet = (totalAmount * retentionPercent) / 100;
    const newTax = (totalAmount * taxPercent) / 100;

    this.subTotal = totalAmount - newRet - newTax;

    this.form.patchValue(
      {
        retentions: Number(newRet.toFixed(2)),
        taxes: Number(newTax.toFixed(2)),
        subtotal: Number(this.subTotal.toFixed(2)),
      },
      { emitEvent: false }
    );

    this._updateOpenBalances();
    this.lastOpenBalanceValue = this._getLastOpenBalance();
  }

  private _formatDateToISODate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return !isNaN(d.getTime()) ? d.toISOString().split('T')[0] : '';
  }

  private _listenPaymenApplied(group: FormGroup): void {
    group
      .get('payment_applied')
      ?.valueChanges.pipe(takeUntil(this.$destroy))
      .subscribe(() => this._updateOpenBalances());
  }

  private _updateOpenBalances(): void {
    let remainingBalance = this.subTotal;

    this.paymentApplications.controls.forEach((control: AbstractControl) => {
      const group = control as FormGroup;

      const paymentApplied = Number(group.get('payment_applied')?.value || 0);
      const openBalance = remainingBalance - paymentApplied;

      group
        .get('open_balance')
        ?.setValue(openBalance > 0 ? +openBalance.toFixed(2) : 0, {
          emitEvent: false,
        });

      remainingBalance = openBalance > 0 ? openBalance : 0;
    });
  }

  private _recalculateTotals(): void {
    const totalAmount = Number(this.form.controls['total_amount']?.value ?? 0);
    const retentions = Number(this.form.controls['retentions']?.value ?? 0);
    const taxes = Number(this.form.controls['taxes']?.value ?? 0);

    this.subTotal = totalAmount - retentions - taxes;

    this.form.patchValue(
      { subtotal: +this.subTotal.toFixed(2) },
      { emitEvent: false }
    );

    this._updateOpenBalances();
    this.lastOpenBalanceValue = this._getLastOpenBalance();
  }

  private _getLastOpenBalance(): number {
    if (this.paymentApplications.length === 0) {
      return this.subTotal;
    }

    const lastRow = this.paymentApplications.at(
      this.paymentApplications.length - 1
    );
    const rawValue = lastRow?.get('open_balance')?.value;
    const numValue = Number(rawValue);

    if (isNaN(numValue)) return 0;

    return +numValue.toFixed(2);
  }

  addPaymentApplication(): void {
    const group = this._payments.createPaymentApplication(
      this._getLastOpenBalance()
    );
    this._listenPaymenApplied(group);
    this.paymentApplications.push(group);
    this.lastOpenBalanceValue = this._getLastOpenBalance();
  }

  onSelectPolicy(): void {
    this.paymentApplicationsControls.forEach(group => {
      const selectedPolicy = group.get('policy_number')?.value;

      if (selectedPolicy && selectedPolicy._id) {
        const policyId = selectedPolicy._id;
        const policyType = selectedPolicy.policy_type_id.name;
        const search: SearchCheckCommissionConfig = {
          insurer_id: selectedPolicy.insurer_id,
          policy_type_id: selectedPolicy.policy_type_id.id,
          category: selectedPolicy.category,
        };

        this._commissions.checkCommissionExists(search).subscribe(exists => {
          if (!exists) {
            this._ui
              .showConfirmationModal({
                text: `This insurer does not have a commission config for policy type "${policyType}" and category "${search.category}". Please configure it before continuing.`,
              })
              .pipe(take(1))
              .subscribe(go => {
                if (go) {
                  this._url.navigateTo(
                    `/portal/insurer/${this.selectedInsuranceId}`
                  );
                } else {
                  group.get('policy_number')?.reset();
                }
              });
            return;
          }

          const prefix =
            this.paramsBySearchPolicies.param == 'account_id' ? 'INVA' : 'INVI';
          this._invoices.searchInvoices(policyId, prefix).subscribe({
            next: (invoices: any) => {
              const selectedInvoice = invoices;
              if (selectedInvoice && Object.keys(selectedInvoice).length > 0) {
                group
                  .get('invoice_number')
                  ?.setValue(
                    `${selectedInvoice.serial} $${
                      selectedInvoice.amount_due - selectedInvoice.amount_paid
                    }`,
                    { emitEvent: false }
                  );
                this._checkPaymentAmount(selectedInvoice, group);
              } else {
                group.get('invoice_number')?.setValue('', { emitEvent: false });
              }
            },
            error: error => {
              console.error(
                'Error fetching invoice for policy',
                policyId,
                error
              );
            },
          });
        });
      }
    });
  }

  onSelectInsurer(insurer: DropdownOptionModel): void {
    if (insurer) {
      this.selectedInsuranceId = insurer.code;
      this.paramsBySearchPolicies = {
        param: 'insurer_id',
        id: insurer.code,
      };
      this.form.setControl('paymentApplications', new FormArray([]));
      this.addPaymentApplication();
    }
  }

  onSelectAccount(account: any): void {
    if (account) {
      this.selectedAccountId = account;
      this.paramsBySearchPolicies = {
        param: 'account_id',
        id: account,
      };
      this.form.setControl('paymentApplications', new FormArray([]));
      this.addPaymentApplication();
    }
  }

  private _checkPaymentAmount(invoice: any, group: AbstractControl): void {
    const remaining = invoice.amount_due - invoice.amount_paid;
    const paymentApplied = group.get('payment_applied')?.value;

    if (paymentApplied > remaining) {
      group.get('payment_applied')?.setErrors({ exceedsBalance: true });
      group.markAsTouched();
      group.updateValueAndValidity();
    } else {
      group.get('payment_applied')?.setErrors(null);
      group.get('payment_applied')?.markAsPristine();
      group.get('payment_applied')?.markAsUntouched();
      group.updateValueAndValidity({ onlySelf: true, emitEvent: true });
    }
  }

  onPaymentAppliedChange(group: FormGroup): void {
    this._updateOpenBalances();

    const policy_id = group.get('policy_number')?.value._id;
    const prefix =
      this.paramsBySearchPolicies.param == 'account_id' ? 'INVA' : 'INVI';
    this._invoices.searchInvoices(policy_id, prefix).subscribe({
      next: (invoices: any[]) => {
        if (invoices && Object.keys(invoices).length > 0) {
          this._checkPaymentAmount(invoices, group);
        }
      },
      error: err => {
        console.error('Error fetching invoices', err);
      },
    });
  }

  openConfirmationModal() {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to create these payments?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this.submitForm();
      });
  }

  submitForm(): void {
    if (this.form.invalid) {
      this._ui.showAlertError('Please complete all required fields');
      this.form.markAllAsTouched();
      return;
    }

    const formValues = this.form.getRawValue();
    const totalPaymentApplied = this.paymentApplications.value.reduce(
      (total: number, app: any) => {
        return total + (app.payment_applied || 0);
      },
      0
    );

    if (formValues.subtotal < totalPaymentApplied) {
      this._ui.showAlertError(
        'The total payment applied cannot exceed the subtotal'
      );
      return;
    }

    const validApplications = (formValues.paymentApplications ?? []).filter(
      (app: any) => !!app?.policy_number
    );

    if (!validApplications.length) {
      this._ui.showAlertError('You must select at least one policy');
      return;
    }

    const prefix =
      this.paramsBySearchPolicies.param == 'account_id' ? 'INVA' : 'INVI';
    const invoiceLookups: Observable<any>[] = validApplications.map(
      (app: any) =>
        this._invoices
          .searchInvoices(app.policy_number._id, prefix)
          .pipe(map((invoices: any) => invoices ?? null))
    );

    this._ui.showLoader();

    forkJoin(invoiceLookups)
      .pipe(
        takeUntil(this.$destroy),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: resolvedInvoices => {
          const payments = validApplications.map((app: any, index: number) => {
            const invoice = Array.isArray(resolvedInvoices[index])
              ? resolvedInvoices[index][0]
              : resolvedInvoices[index];

            return {
              ach_number: formValues.check_number || null,
              agency_id: this.agencyId,
              broker_id: app.policy_number?.client_id?.broker_id || null,
              client_id: app.policy_number?.client_id?._id || null,
              insurer_id: app.policy_number?.insurer_id || null,
              invoice_id: invoice?._id || null,
              payment_applied: app.payment_applied || 0,
              payment_date: formValues.payment_date
                ? this._formatDateToISODate(formValues.payment_date)
                : null,
              policy_id: app.policy_number?._id || null,
            };
          });

          const payload: CreatePaymentsTransactionsRequest = {
            total_amount: formValues.total_amount,
            ach_number: formValues.check_number || null,
            date: formValues.payment_date,
            method: 'bank_transfer',
            retentions: formValues.retentions ?? 0,
            taxes: formValues.taxes ?? 0,
            subtotal: formValues.subtotal ?? 0,
            payment_from: formValues.payment_from,
            payments,
          };

          this._payments.postPaymentTransaction(payload).subscribe({
            next: (resp: PaymentTransactionModel) => {
              this._openSuccessModal(resp);
            },
            error: () => {
              this._ui.showAlertError('Failed to submit payment transaction');
            },
          });
        },
        error: () => {
          this._ui.showAlertError('Failed to resolve invoices');
        },
      });
  }

  private _openSuccessModal(payment: PaymentTransactionModel) {
    const paymentSerial = payment.serial;
    const message = `The payment {{link}} has been updated successfully`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: paymentSerial,
          url: ['/portal/payments', payment._id],
        },
      })
      .subscribe(result => {
        if (result !== 'link') {
          this.router.navigate(['/portal/payments']);
        }
      });
  }

  cancelForm() {
    this.router.navigate(['/portal/payments']);
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
