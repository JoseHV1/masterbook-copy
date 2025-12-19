import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnChanges,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, take, tap } from 'rxjs';
import { FormsModalComponent } from 'src/app/portal/forms/components/forms-modal/forms-modal.component';
import { PolicyCategoryEnum } from 'src/app/shared/enums/policy-category.enum';
import { RequestType } from 'src/app/shared/enums/request-type.enum';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import {
  PopulatedRequestModel,
  RequestModel,
} from 'src/app/shared/interfaces/models/request.model';
import { PopulatedUserModel } from 'src/app/shared/interfaces/models/user.model';
import { CreateRequestRequest } from 'src/app/shared/interfaces/requests/requests/create-request.request';
import { UpdateRequestRequest } from 'src/app/shared/interfaces/requests/requests/update-request.request';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-form-new-business',
  templateUrl: './form-new-business.component.html',
  styleUrls: ['./form-new-business.component.scss'],
})
export class FormNewBusinessComponent implements OnChanges, OnInit {
  @Output() back: EventEmitter<boolean> = new EventEmitter();
  @Input() selectedType?: PopulatedPolicyTypeModel;
  @Input() selectedEndorsements?: PopulatedPolicyTypeModel[];
  @Input() request?: PopulatedRequestModel;

  form!: FormGroup;
  preselectedAccount?: string;
  selectedAccount?: PopulatedAccount;
  policy_types: PopulatedPolicyTypeModel[] = [];

  constructor(
    private _auth: AuthService,
    private _request: RequestsService,
    private _ui: UiService,
    private _activateRoute: ActivatedRoute,
    private _accounts: AccountsService,
    private _router: Router,
    private _dialog: MatDialog,
    private _datasets: DatasetsService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    const currentUser = this._auth.getAuth()?.user as PopulatedUserModel;

    this.preselectedAccount =
      currentUser.role === RolesEnum.INSURED
        ? currentUser.account_id
        : this._activateRoute.snapshot.queryParams['account'];

    if (this.preselectedAccount) {
      this._ui.showLoader();
      this._accounts
        .getAccount(this.preselectedAccount)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(account => {
          this.selectedAccount = account;
          this.form.patchValue({ client_id: account._id });
          this.fillVisualProps(account);
        });
    }

    this._fetchPolicyTypes().subscribe();
  }

  ngOnChanges(): void {
    if (this.request) {
      this.fillVisualProps(this.request.client);
      this.form.patchValue({
        client_id: this.request.client_id,
        insure_object: this.request.insure_object,
        coverage: this.request.coverage,
        request_documents: this.request.request_documents,
        address_info: this.request.address_info,
      });
    }
  }

  initForm(): void {
    this.form = new FormGroup({
      //solo visuales (no llegan a traves del .value al estar disabled)
      account_serial: new FormControl({ value: null, disabled: true }),
      account_name: new FormControl({ value: null, disabled: true }),
      agent_fullname: new FormControl({ value: null, disabled: true }),
      client_fullname: new FormControl({ value: null, disabled: true }),
      dob: new FormControl({ value: null, disabled: true }),
      gender: new FormControl({ value: null, disabled: true }),
      marital_status: new FormControl({ value: null, disabled: true }),
      country: new FormControl({ value: null, disabled: true }),
      address: new FormControl({ value: null, disabled: true }),
      email: new FormControl({ value: null, disabled: true }),
      phone: new FormControl({ value: null, disabled: true }),
      //props reales del form
      client_id: new FormControl(null, [Validators.required]),
      insure_object: new FormControl(null, [Validators.required]),
      coverage: new FormControl(null, [Validators.required]),
      request_documents: new FormControl(null, [Validators.required]),
      address_info: new FormControl(null, [Validators.required]),
    });
  }

  handleAccountSelection(
    event: PopulatedAccount | PopulatedAccount[] | undefined
  ): void {
    const singularAccount = event as PopulatedAccount | undefined;
    this.selectedAccount = singularAccount;
    this.fillVisualProps(singularAccount);
  }

  fillVisualProps(account?: PopulatedAccount): void {
    this.form.patchValue({
      account_serial: account?.serial ?? '',
      account_name: account?.account_name ?? '',
      agent_fullname: `${account?.broker?.user?.first_name ?? ''} ${
        account?.broker?.user?.last_name ?? ''
      }`,
      client_fullname: `${account?.user?.first_name ?? ''} ${
        account?.user?.last_name ?? ''
      }`,
      dob: account?.user?.date_of_birth ?? undefined,
      gender: account?.user?.gender ?? undefined,
      marital_status: account?.user?.marital_status ?? undefined,
      country: account?.user?.address_info?.country ?? undefined,
      address: account?.user?.address_info?.address ?? undefined,
      email: account?.user?.email ?? undefined,
      phone: account?.user?.phone_number ?? undefined,
    });
  }

  _fetchPolicyTypes() {
    const type_id = this.selectedType?._id ?? this.request?.policy_type_id;
    let type_ids = [type_id];
    const endorsements =
      this.selectedEndorsements?.map(item => item._id) ??
      this.request?.endorsement_ids;
    if (endorsements) type_ids = [...type_ids, ...endorsements];
    return this._datasets.getPolcyTpesDataset().pipe(
      map(resp => resp.filter(item => type_ids.includes(item._id))),
      tap(resp => (this.policy_types = resp)),
      tap(resp => {
        const type = resp.find(item => item._id === type_id);
        const control = this.form.get('insure_object');
        control?.setValue(type?.name + ' ');
      })
    );
  }

  reset(): void {
    this.form.reset();

    if (this.preselectedAccount) {
      this.form.patchValue({ client_id: this.preselectedAccount });
      this.fillVisualProps(this.selectedAccount);
      return;
    }

    this.selectedAccount = undefined;
  }

  send() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid && this.form.controls['account'].value === 0) return;

    if (this.request) {
      this._editData();
      return;
    }

    this._saveData();
  }

  private _saveData() {
    const req = {
      ...this.form.value,
      policy_type_id: this.selectedType?._id ?? '',
      category: PolicyCategoryEnum.NEW_BUSINESS,
      endorsement_ids: (this.selectedEndorsements ?? []).map(item => item._id),
      coverage: parseFloat(parseFloat(this.form.value.coverage).toFixed(2)),
    } as CreateRequestRequest;

    this._ui.showLoader();
    this._request
      .createRequest(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(request => {
        this.reset();
        this._openSuccessModal(request, 'created');
      });
  }

  private _editData() {
    const req = {
      ...this.form.value,
      coverage: parseFloat(parseFloat(this.form.value.coverage).toFixed(2)),
    } as UpdateRequestRequest;

    this._ui.showLoader();
    this._request
      .editRequest(req, this.request?._id ?? '')
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(request => {
        this.reset();
        this._openSuccessModal(request, 'updated');
      });
  }

  private _openSuccessModal(
    request: RequestModel,
    action: 'created' | 'updated'
  ) {
    const message = `The request {{link}} has been ${action} successfully.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: `#${request.serial}`,
          url: ['/portal/requests', request._id],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/requests']);
        }
      });
  }

  cancel(): void {
    this.back.emit();
  }

  openModalForms(policy_type: PopulatedPolicyTypeModel) {
    this._dialog
      .open(FormsModalComponent, {
        data: { policy_type },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe();
  }
}

export interface NewBusinessFormData {
  category: PolicyCategoryEnum;
  business_line_id: string;
  request_type: RequestType;
}
