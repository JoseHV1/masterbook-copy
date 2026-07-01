import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { isInvalid } from '../../../../shared/helpers/is-invalid.helper';
import { hasError } from '../../../../shared/helpers/has-error.helper';
import { UiService } from 'src/app/shared/services/ui.service';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';
import { finalize, forkJoin, Observable, Subject, take, takeUntil, tap } from 'rxjs';
import { InsuranceCompanyModel } from 'src/app/shared/interfaces/models/insurance-company.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { Location } from '@angular/common';
import { CreatePolicyRequest } from 'src/app/shared/interfaces/requests/policies/create-policy.request';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { EditPolicyRequest } from 'src/app/shared/interfaces/requests/policies/edit-policy.request';
import { PolicyStatus } from 'src/app/shared/enums/policy-status.enum';
import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { IntegrationsService } from '@app/shared/services/integration.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policy-form',
  templateUrl: './policy-form.component.html',
  styleUrls: ['./policy-form.component.scss'],
})
export class PolicyFormComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();
  @Input() preFilledInfo!: Partial<CreatePolicyRequest>;
  @Input() policy?: Partial<PopulatedPolicyModel>;

  connected = false;

  form!: FormGroup;
  insuranceCompanyOptions: DropdownOption[] = [];
  today: Date = new Date();
  showAgentSelector = false;

  isInvalid = isInvalid;
  hasError = hasError;

  constructor(
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _dataset: DatasetsService,
    private _policy: PoliciesService,
    private _cd: ChangeDetectorRef,
    private _auth: AuthService,
    private _integrations: IntegrationsService,
    private _t: TranslateService
  ) {
    this.showAgentSelector = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role as RolesEnum
    );
  }

  ngOnInit(): void {
    this._initData();
    this._initForm();
    this._fillForm();

    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;
      },
      error: err => {
        console.error('status failed', err);
      },
    });
  }

  private _initData(): void {
    this._ui.showLoader();
    forkJoin([this._loadInsuranceCompanies()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();
  }

  private _loadInsuranceCompanies(): Observable<InsuranceCompanyModel[]> {
    return this._dataset.getInsuranceCompaniesDataset().pipe(
      tap(
        companies =>
          (this.insuranceCompanyOptions = companies.map(item => ({
            code: item._id,
            name: item.name,
            serial: item.serial,
          })))
      )
    );
  }

  private _initForm(): void {
    if (this.preFilledInfo) {
      this.form = this._policy.createPolicyForm(
        this.today,
        this.preFilledInfo.policy_type_id ?? '',
        this.preFilledInfo.category ?? PolicyCategoryEnum.NEW_BUSINESS
      );
    } else {
      this.form = this._policy.createPolicyForm(
        this.today,
        '',
        PolicyCategoryEnum.NEW_BUSINESS
      );
    }

    if (!this.showAgentSelector) {
      this.form.get('agent_id')?.setValidators(null);
      this.form.get('agent_id')?.disable();
    }

    this._listenToInsurerChanges();
  }

  private _listenToInsurerChanges(): void {
    const insurerControl = this.form.get('insurer_id');

    if (insurerControl) {
      insurerControl.statusChanges.pipe(takeUntil(this._destroy$)).subscribe(status => {
        if (status === 'INVALID') {
          const errors = insurerControl.errors;

          if (errors && errors['UNCONFIGINSURER']) {
            const selectedInsurer = this.insuranceCompanyOptions.find(
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
                .subscribe();
            }
          }
        }
      });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _fillForm(): void {
    if (this.policy) {
      this.form.patchValue({
        ...this.policy,
        pending: 'No',
        document: this.policy.document,
        request_documents: this.policy.request_documents,
      });

      this._cd.detectChanges();
      return;
    }

    if (this.preFilledInfo) {
      this.form.patchValue({
        insurer_id: this.preFilledInfo.insurer_id ?? '',
        prime_amount: this.preFilledInfo.prime_amount,
        coverage: this.preFilledInfo.coverage,
        deductible: this.preFilledInfo.deductible,
        agent_id: this.preFilledInfo.agent_id,
        insure_object: this.preFilledInfo.insure_object,
        request_documents: this.preFilledInfo.request_documents,
        end_date: new Date(
          new Date().setFullYear(new Date().getFullYear() + 1)
        ),
      });

      ['prime_amount', 'coverage', 'deductible'].forEach(field => {
        if (this.preFilledInfo[field as keyof typeof this.preFilledInfo]) {
          this.form.get(field)?.disable();
        }
      });
    }
  }

  get minExpirationDate(): Date {
    return this.form.get('start_date')?.value ?? this.today;
  }

  goBack(): void {
    this._location.back();
  }

  openConfirmationModal() {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.POLICIES.CONFIRM_SAVE'),
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this.savePolicy();
      });
  }

  savePolicy(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const isNew = !this.policy;

    const req = isNew
      ? (this.buildPolicyRequest(true) as CreatePolicyRequest)
      : (this.buildPolicyRequest(false) as EditPolicyRequest);

    this._ui.showLoader();

    const obs = isNew
      ? this._policy.createPolicy(req as CreatePolicyRequest)
      : this._policy.editPolicy(
          this.policy?._id ?? '',
          req as EditPolicyRequest
        );

    obs.pipe(finalize(() => this._ui.hideLoader())).subscribe({
      next: resp => {
        if (resp && resp['serial'] && resp['_id']) {
          this.form.reset();
          if (
            this._auth.getAuth()?.user?.role === RolesEnum.INSURED ||
            !this.connected
          ) {
            this._openSuccessModal(resp['serial'] ?? '', resp['_id'] ?? '');
          } else {
            if (this.policy) {
              this._openSuccessModal(resp['serial'] ?? '', resp['_id'] ?? '');
            } else {
              this._openSendEmailModal(resp['serial'] ?? '', resp['_id'] ?? '');
            }
          }
        } else {
          this._ui.showAlertError(this._t.instant('PORTAL.POLICIES.INTERNAL_ERROR'));
        }
      },
      error: err => {
        console.error('Error al guardar la póliza:', err);
      },
    });
  }

  private buildPolicyRequest(
    isNew: boolean
  ): CreatePolicyRequest | EditPolicyRequest {
    const formValue = this.form.getRawValue();
    const today = new Date();

    const startDate = formValue.start_date
      ? new Date(formValue.start_date)
      : null;
    const endDate = formValue.end_date ? new Date(formValue.end_date) : null;

    const status: PolicyStatus =
      startDate && endDate && today >= startDate && today <= endDate
        ? PolicyStatus.ACTIVE
        : PolicyStatus.PENDING;

    if (!isNew) {
      const req: EditPolicyRequest = {
        insurer_id: formValue.insurer_id,
        policy_number: formValue.policy_number,
        description: formValue.description,
        prime_amount: formValue.prime_amount,
        coverage: formValue.coverage,
        deductible: formValue.deductible,
        document: formValue.document,
        request_documents: formValue.request_documents,
        start_date: startDate!,
        end_date: endDate!,
        status,
        agent_id: formValue.agent_id,
        insure_object: formValue.insure_object,
      };
      return req;
    } else {
      const req: CreatePolicyRequest = {
        ...formValue,
        quote_id: this.preFilledInfo.quote_id,
        client_id: this.preFilledInfo.client_id,
        policy_type_id: this.preFilledInfo.policy_type_id ?? '',
        category: this.preFilledInfo.category,
        endorsement_ids: this.preFilledInfo.endorsement_ids ?? [],
        insurer_id: this.preFilledInfo.insurer_id ?? formValue.insurer_id,
        prime_amount: this.preFilledInfo.prime_amount ?? formValue.prime_amount,
        coverage: this.preFilledInfo.coverage ?? formValue.coverage,
        deductible: this.preFilledInfo.deductible ?? formValue.deductible,
        start_date: startDate!,
        end_date: endDate!,
        status,
        request_documents: formValue.request_documents ?? [],
        refered_policy_id: this.preFilledInfo.refered_policy_id ?? undefined,
      };
      return req;
    }
  }

  private _openSuccessModal(serial: string, _id: string) {
    const message = this.policy
      ? this._t.instant('PORTAL.POLICIES.UPDATED_SUCCESS_TEXT')
      : this._t.instant('PORTAL.POLICIES.CREATED_SUCCESS_TEXT');

    this._ui
      .showInformationModal({
        text: message,
        title: this._t.instant('PORTAL.POLICIES.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: `#${serial}`,
          url: ['/portal/policies', serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/policies']);
        }
      });
  }

  private _openSendEmailModal(serial: string, _id: string) {
    const emailKey = this.policy ? 'PORTAL.POLICIES.EMAIL_UPDATED_TEXT' : 'PORTAL.POLICIES.EMAIL_CREATED_TEXT';
    const message = this._t.instant(emailKey, { serial });

    this._ui
      .showInformationModal({
        text: message,
        title: this._t.instant('PORTAL.POLICIES.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
        additionalButton: true,
      })
      .subscribe(result => {
        if (result === 'accept') {
          this._ui.showLoader();

          this._policy.sendPolicyInvoicesByEmail(_id).subscribe({
            next: () => {
              this._ui.hideLoader();
              this._ui.showAlertSuccess(this._t.instant('PORTAL.POLICIES.EMAIL_SENT'));
              this._router.navigate(['/portal/policies']);
            },
            error: err => {
              this._ui.hideLoader();
              this._ui.showAlertError(
                this._t.instant('PORTAL.POLICIES.EMAIL_SEND_ERROR')
              );
            },
          });

          return;
        }

        this._router.navigate(['/portal/policies']);
      });
  }
}
