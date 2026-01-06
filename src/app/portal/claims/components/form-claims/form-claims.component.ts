import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, take } from 'rxjs';
import { addZero } from 'src/app/shared/helpers/add-zero';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AccountsModel } from 'src/app/shared/models/DTO/account/accounts.model';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { ClaimsService } from 'src/app/shared/services/claims.service';
import { InputUtils } from 'src/app/shared/helpers/onlyNumbers';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { FilePreviewModalComponent } from '../file-preview-modal/file-preview-modal.component';
import { SelectedFile } from 'src/app/shared/interfaces/models/select-file.model';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { CreateClaimRequest } from 'src/app/shared/interfaces/requests/claims/create-claim.request';
import { PopulatedClaimModel } from 'src/app/shared/interfaces/models/claims.model';
import { ClaimModel } from 'src/app/shared/models/claim.model';

@Component({
  selector: 'app-form-claims',
  templateUrl: './form-claims.component.html',
  styleUrls: ['./form-claims.component.scss'],
})
export class FormClaimsComponent implements OnInit {
  @Input() data?: PopulatedClaimModel;
  @Output() selectAccount = new EventEmitter<AccountsModel>();

  policies!: {
    code: string;
    name: string;
    insurer_id: string;
    insurer_name: string;
  }[];
  auth!: AuthModel;
  userIsAgent = false;
  form!: FormGroup;

  fileNamesText = 'No images chosen';

  dropDownMaritalStatus: DropdownOptionModel[] =
    enumToDropDown(MaritalStatusEnum);
  dropDownGender: DropdownOptionModel[] = enumToDropDown(GenderEnum);
  accountName: string = '';
  accountId: string = '';
  policyId: string = '';
  insuranceCompanyId: string = '';

  selectedFiles: SelectedFile[] = [];
  allowed_types: string[] = ['PNG', 'JPG', 'JPEG', 'PDF'];
  addZero = addZero;

  constructor(
    private _router: Router,
    private _ui: UiService,
    private _auth: AuthService,
    private _claims: ClaimsService,
    private _policies: PoliciesService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.auth = this._auth.getAuth() as AuthModel;
    this.userIsAgent =
      this.auth.user.role === RolesEnum.AGENCY_BROKER ||
      this.auth.user.role === RolesEnum.INDEPENDANT_BROKER;

    this.form = this._claims.getClaimsForm();
    this.form.get('account_name')?.disable();

    this.form
      .get('policy_id')
      ?.valueChanges.subscribe(policyId => this.onPolicySelected(policyId));

    if (this.data) {
      this.accountId = this.data.client?._id ?? this.data.client_id;
      this.policyId = this.data.policy?._id ?? this.data.policy_id;
      this.insuranceCompanyId = this.data.insurer_id ?? '';
      this.accountName = this.data.client?.account_name ?? '';

      await this.loadPolicies(this.accountId);
    }
  }

  onlyAllowNumbers(event: KeyboardEvent) {
    InputUtils.onlyAllowNumbers(event);
  }

  openFilePreview(index: number): void {
    this.dialog.open(FilePreviewModalComponent, {
      width: '90%',
      maxWidth: '900px',
      data: {
        files: this.selectedFiles,
        selectedIndex: index,
      },
      panelClass: 'custom-dialog-panel',
    });
  }

  fillData(item: any) {
    this._ui.showLoader();
    this.selectAccount.emit(item);

    if (item.account_name) {
      this.form.patchValue({ account_name: item.account_name });
      this.accountName = item.account_name;
      this.accountId = item._id;
    }

    this.loadPolicies(item._id);
  }

  loadPolicies(clientId: string) {
    this._policies
      .getPolicies(0, 10, `&client_id=${clientId}`)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: resp => {
          this.policies = resp.records.map((item: PopulatedPolicyModel) => ({
            code: item._id,
            name: `${item.serial} #${item.policy_number}`,
            insurer_id: item.insurer?._id ?? '',
            insurer_name: item.insurer?.name ?? '',
          }));

          const matchedPolicy = this.policies.find(
            policy => policy.code === this.policyId
          );

          if (this.data) {
            this.form.patchValue({
              account_name: this.accountName,
              location: { address: this.data.location },
              event_date: this.data.event_date,
              description: this.data.description,
              amount_requested: Number(this.data.amount_requested),
              policy_id: matchedPolicy ?? null,
            });

            this.selectedFiles =
              this.data.attachments?.map(file => ({
                name: file.name,
                weight: file.weight,
                document: file.url,
                preview: file.url,
                uploaded_at: file.uploaded_at,
                extension: file.extension.toLowerCase(),
              })) ?? [];

            this.fileNamesText = `${this.selectedFiles.length} file(s) selected`;
          }
        },
      });
  }

  reset() {
    this.form.reset();
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    if (this.selectedFiles.length + files.length > 10) {
      this._ui.showAlertError('You can only select up to 10 files.');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      const extension = file.name.split('.').pop()?.toUpperCase() || '';

      if (!this.allowed_types.includes(extension)) {
        this._ui.showAlertError(`File type not allowed: ${file.name}`);
        return;
      }

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result as string;
        const fileInfo = {
          weight: file.size,
          name: file.name.split('.').slice(0, -1).join('.'),
          extension: file.name.split('.').pop()?.toLowerCase() || '',
          document: result,
          preview: extension === 'PDF' ? null : result,
        };

        this.selectedFiles.push(fileInfo);

        this.fileNamesText = `${this.selectedFiles.length} file(s) selected`;
      };

      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        reader.readAsDataURL(file);
      }
    });

    input.value = '';
  }

  removeFile(fileToRemove: SelectedFile) {
    this.selectedFiles = this.selectedFiles.filter(
      f => f.name !== fileToRemove.name
    );
    this.fileNamesText =
      this.selectedFiles.length > 0
        ? `${this.selectedFiles.length} file(s) selected`
        : 'No files chosen';
  }

  getBase64Files(): { filename: string; base64: string; mimeType: string }[] {
    return this.selectedFiles
      .filter(file => file.document)
      .map(file => ({
        filename: file.name,
        base64: file.document ?? '',
        mimeType: file.extension,
      }));
  }

  onPolicySelected(policy: any) {
    this.insuranceCompanyId = policy?.insurer_id ?? '';
    this.policyId = policy?.code ?? policy;
  }

  handleAddress(address?: AddressAutocompleteModel) {
    this.form.patchValue({
      location: address?.address ?? '',
    });
    this.form.get('location')!.markAsTouched();
  }

  resetAddress(): void {
    this.form.controls['address'].patchValue(null);
    this.form.controls['address'].markAsDirty();
  }

  cancelForm() {
    this._router.navigate(['/portal/claims']);
  }

  openConfirmationModal() {
    const action = this.data ? 'edit' : 'save';
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to ${action} this claim?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this.sendForm();
        }
      });
  }

  sendForm() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (!this.data && this.form.invalid) return;

    const req = this.getDataAsRequest();

    this._ui.showLoader();
    if (!this.data) {
      this._claims
        .createClaim(req)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this.openSuccessModal(resp._id, resp.serial, 'created');
        });
    } else {
      this._claims
        .updateClaim(this.data._id, req)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this.openSuccessModal(resp._id, resp.serial, 'updated');
        });
    }
  }

  getDataAsRequest(): CreateClaimRequest {
    const { account_name, event_date, location, account, ...formValues } =
      this.form.value;

    const cleanedFiles = this.selectedFiles.map(file => {
      return {
        name: file.name,
        document: file.document,
        extension: file.extension.toUpperCase(),
        weight: file.weight,
        uploaded_at: file.uploaded_at,
      };
    });

    return {
      ...formValues,
      attachments: cleanedFiles,
      event_date,
      agency_id: this.auth.user.agency_id,
      broker_id: this.auth.user.broker_id,
      client_id: this.accountId,
      policy_id: this.policyId,
      insurer_id: this.insuranceCompanyId,
      location: location?.address ?? '',
    };
  }

  formatDate(dateToTransform: Date): string {
    return `${dateToTransform.getFullYear()}-${addZero(
      dateToTransform.getMonth() + 1
    )}-${addZero(dateToTransform.getDate())}`;
  }

  openSuccessModal(
    claimId: string,
    claimSerial: string,
    action: 'created' | 'updated'
  ) {
    const message = `The claim {{link}} has been ${action} successfully.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: claimSerial,
          url: ['/portal/claims', claimSerial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/claims']);
        }
      });
  }
}
