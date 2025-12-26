import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  catchError,
  filter,
  finalize,
  forkJoin,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { QuoteStatusEnum } from 'src/app/shared/enums/quote-status.enum';
import { RequestStatusEnum } from 'src/app/shared/enums/request-status.enum';
import { InsuranceCompanyModel } from 'src/app/shared/interfaces/models/insurance-company.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { PopulatedQuoteModel } from 'src/app/shared/interfaces/models/quote.model';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { CreateQuoteRequest } from 'src/app/shared/interfaces/requests/quotes/create-quote.request';
import { UpdateQuoteStatusRequest } from 'src/app/shared/interfaces/requests/quotes/update-quote-status.request';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { QuotesService } from 'src/app/shared/services/quotes.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';
import { fileUploadMode } from 'src/core/cdk/file-upload/file-upload.component';
import { RejectRequestModalComponent } from '../../components/reject-policy-modal/reject-request-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FileInfoModel } from 'src/app/shared/interfaces/models/file-info.model';
import { ConfiguredInsurerAsyncValidator } from 'src/app/shared/helpers/configured-insurer.validator';
import { InsurerService } from 'src/app/shared/services/insurer.service';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { AuthService } from '@app/shared/services/auth.service';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnDestroy {
  request!: PopulatedRequestModel;
  refreredPolicy?: PopulatedPolicyModel;
  REQUEST_STATUS = RequestStatusEnum;
  POLICY_CATEGORY = PolicyCategoryEnum;
  quotesForm!: FormGroup;
  insuranceCompaniesItems: DropdownOption[] = [];
  fileUploadMode = fileUploadMode;
  quotes: PopulatedQuoteModel[] = [];
  showActions = false;
  rolesEnum = RolesEnum;
  isInsured = false;
  filterText = '';
  isOwner!: boolean;

  get baseRequestsPath() {
    return this.showActions ? 'portal/requests' : 'portal-client/requests';
  }
  get basePoliciesPath() {
    return this.showActions ? 'portal/policies' : 'portal-client/policies';
  }

  private destroy$ = new Subject<void>();

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _requests: RequestsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _dataset: DatasetsService,
    private _quotes: QuotesService,
    private _policy: PoliciesService,
    private _dialog: MatDialog,
    private _insurer: InsurerService,
    private _auth: AuthService,
    private dialog: MatDialog
  ) {
    this.isOwner = ownersRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
    this._initData();
    this.updateActionsVisibility(this._router.url);
    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) => {
        this.updateActionsVisibility(e.urlAfterRedirects || e.url);
      });
    this.isInsured = this._auth.getAuth()?.user.role === this.rolesEnum.INSURED;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  private updateActionsVisibility(url: string): void {
    this.showActions =
      url.includes('/portal/') && !url.includes('/portal-client/');
  }

  private _initData(): void {
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._fetchRequestData(id);
        }),
        switchMap(() => {
          this.filterText = `&request_id=${this.request._id}`;
          return forkJoin([
            this._fetchQuotesData(this.request._id),
            this._loadInsuranceCompanies(),
          ]);
        }),
        finalize(() => this._ui.hideLoader()),
        catchError(() => this._router.navigateByUrl('portal/requests'))
      )
      .subscribe(() => this._initQuotesForm());
  }

  private _fetchRequestData(
    id: string
  ): Observable<PopulatedRequestModel | PopulatedPolicyModel> {
    return this._requests.getRequestBySerial(id).pipe(
      tap(request => (this.request = request)),
      switchMap(request => {
        if (request.refered_policy_id) {
          return this._policy
            .getPolicy(request.refered_policy_id)
            .pipe(tap(policy => (this.refreredPolicy = policy)));
        }
        return of(request);
      })
    );
  }

  private _fetchQuotesData(id: string): Observable<PopulatedQuoteModel[]> {
    return this._quotes
      .getQuotesByRequest(id)
      .pipe(tap(quotes => (this.quotes = quotes)));
  }

  private _loadInsuranceCompanies(): Observable<InsuranceCompanyModel[]> {
    return this._dataset.getInsuranceCompaniesDataset().pipe(
      tap(
        companies =>
          (this.insuranceCompaniesItems = companies.map(item => ({
            code: item._id,
            name: item.name,
          })))
      )
    );
  }

  private _initQuotesForm(): void {
    this.quotesForm = new FormGroup({
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
      coverage: new FormControl(null, [Validators.required]),
      deductible: new FormControl(null, [Validators.required]),
      document: new FormControl(null, [Validators.required]),
    });
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

  saveQuote(): void {
    this.quotesForm.markAsDirty();
    this.quotesForm.markAllAsTouched();

    if (this.quotesForm.invalid) {
      return;
    }

    const req: CreateQuoteRequest = {
      ...this.quotesForm.value,
      request_id: this.request._id,
    };

    this._ui.showLoader();
    this._quotes
      .createQuote(req)
      .pipe(
        switchMap(() => this._fetchQuotesData(this.request._id)),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._ui.showAlertSuccess('Quote created successfully!');
        this.quotesForm.reset();
      });
  }

  openRejectRequestModal(): void {
    this._dialog
      .open(RejectRequestModalComponent, {
        data: { request: this.request },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(resp => {
          if (resp) {
            return this._fetchRequestData(this.request._id);
          }
          return of(resp);
        })
      )
      .subscribe();
  }

  setQuoteStatus(status: QuoteStatusEnum, quote_id: string): void {
    const req: UpdateQuoteStatusRequest = {
      quote_id,
      status,
    };

    this._ui.showLoader();
    this._quotes
      .setQuoteStatus(req)
      .pipe(
        switchMap(() =>
          forkJoin([
            this._fetchRequestData(this.request._id),
            this._fetchQuotesData(this.request._id),
          ])
        ),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._ui.showAlertSuccess('Quote status set successfully!');
      });
  }

  cancelPolicy(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to accept cancellation of this policy?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeCancellation();
      });
  }

  private _executeCancellation(): void {
    this._ui.showLoader();
    this._policy
      .cancelPolicy(this.refreredPolicy?._id ?? '')
      .pipe(
        switchMap(() => this._fetchRequestData(this.request.serial)),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._ui.showAlertSuccess('Policy cancelled successfully');
      });
  }

  goToPolicy(quote: PopulatedQuoteModel): void {
    this._router.navigateByUrl(`portal/policies/new?quote=${quote._id}`);
  }

  openAttach(data: string | FileInfoModel): void {
    window.open(typeof data === 'string' ? data : data.document, '_blank');
  }

  goBack(): void {
    this._location.back();
  }

  deleteRequest(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this request?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this._executeDelete(_id);
        }
      });
  }
  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._requests
      .deleteRequest(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Request deleted successfully');
        this._router.navigateByUrl('portal/requests');
      });
  }
}
