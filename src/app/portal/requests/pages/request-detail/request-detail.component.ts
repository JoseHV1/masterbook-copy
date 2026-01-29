import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import {
  catchError,
  filter,
  finalize,
  forkJoin,
  map,
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
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { PopulatedQuoteModel } from 'src/app/shared/interfaces/models/quote.model';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { UpdateQuoteStatusRequest } from 'src/app/shared/interfaces/requests/quotes/update-quote-status.request';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { QuotesService } from 'src/app/shared/services/quotes.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { RejectRequestModalComponent } from '../../components/reject-policy-modal/reject-request-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FileInfoModel } from 'src/app/shared/interfaces/models/file-info.model';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { AuthService } from '@app/shared/services/auth.service';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { IntegrationsService } from '@app/shared/services/integration.service';
import { RequestViaEmailModel } from '@app/shared/models/request-via-email.model';
import { ModalNewQuoteComponent } from '../../components/modal-new-quote/modal-new-quote.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UpdateRequestRequest } from '@app/shared/interfaces/requests/requests/update-request.request';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { FormsModalComponent } from '@app/portal/forms/components/forms-modal/forms-modal.component';
import { DatasetsService } from '@app/shared/services/dataset.service';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.scss'],
})
export class RequestDetailComponent implements OnInit, OnDestroy {
  request!: PopulatedRequestModel;
  refreredPolicy?: PopulatedPolicyModel;
  REQUEST_STATUS = RequestStatusEnum;
  POLICY_CATEGORY = PolicyCategoryEnum;
  quotes: PopulatedQuoteModel[] = [];
  showActions = false;
  rolesEnum = RolesEnum;
  isInsured = false;
  filterText = '';
  isOwner!: boolean;
  isBroker: boolean = false;
  connected: boolean = false;
  form!: FormGroup;

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
    private _quotes: QuotesService,
    private _policy: PoliciesService,
    private _dialog: MatDialog,
    private _auth: AuthService,
    private _integrations: IntegrationsService,
    private _uploadFile: UploadFileService,
    private _datasets: DatasetsService
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

    this.isBroker =
      this._auth.getAuth()?.user.role !== RolesEnum.INSURED &&
      this._auth.getAuth()?.user.role !== RolesEnum.ADMIN;

    this.form = new FormGroup({
      request_documents: new FormControl(null, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;
      },
      error: err => {
        this._ui.showAlertError(`Status failed ${err}`);
      },
    });
  }

  loginGoogle() {
    if (!this.connected) {
      const returnTo = `/portal/request/${this.request.serial}`;
      this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
        window.location.href = url;
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModalChangeLogs(entityId: string): void {
    this._dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  sendQuoteViaEmail(document_position: number) {
    const payload: RequestViaEmailModel = {
      document_id: document_position,
      request_id: this.request._id,
    };

    this._ui.showLoader();
    this._requests
      .sendQuoteViaEmailToInsurers(payload)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: resp => {
          this._openSuccessModal(resp);
        },
        error: () => {},
      });
  }

  private _openSuccessModal(resp: { message: string; count: number }) {
    this._ui.showInformationModal({
      text: `The email has been sent to ${resp.count} insurers`,
      title: 'SUCCESS!',
      type: UiModalTypeEnum.SUCCESS,
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
          return forkJoin([this._fetchQuotesData(this.request._id)]);
        }),
        finalize(() => this._ui.hideLoader()),
        catchError(() => this._router.navigateByUrl('portal/requests'))
      )
      .subscribe();
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

  openModalForms() {
    this._ui.showLoader();
    this._datasets
      .getPolcyTpesDataset()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        const policy_type = resp.find(
          item => item._id === this.request.policy_type_id
        );
        console.log(policy_type);
        this._dialog
          .open(FormsModalComponent, {
            data: { policy_type, show_email: false },
            autoFocus: false,
            panelClass: 'transparent-modal-container',
          })
          .afterClosed()
          .pipe(take(1))
          .subscribe();
      });
  }

  private _fetchQuotesData(id: string): Observable<PopulatedQuoteModel[]> {
    return this._quotes
      .getQuotesByRequest(id)
      .pipe(tap(quotes => (this.quotes = quotes)));
  }

  handleCreateQuote(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.openModalNewQuote();
  }

  openModalNewQuote() {
    const dialogRef = this._dialog.open(ModalNewQuoteComponent, {
      panelClass: 'custom-dialog-container',
      data: {
        request: this.request,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this._fetchQuotesData(this.request._id).subscribe();
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
            this._fetchRequestData(this.request.serial),
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
    const fileKey = typeof data === 'string' ? data : data.document;

    if (!fileKey) return;

    this._uploadFile.getUrlFile(fileKey).subscribe({
      next: res => {
        if (res) {
          window.open(res, '_blank');
        }
      },
      error: err => {
        console.error('Error al obtener el acceso al archivo', err);
      },
    });
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

  uploadRequestForm() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const req: Partial<UpdateRequestRequest> = {
      request_documents: [this.form.get('request_documents')?.value],
    };

    this._ui.showLoader();
    this._requests
      .editRequest(req, this.request?._id ?? '')
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.form.reset();
        this._ui.showAlertSuccess('Request document upload successfully!');
        window.location.href = window.location.href;
      });
  }
}
