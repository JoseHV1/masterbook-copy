import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { provideNgxMask } from 'ngx-mask';
import { finalize, forkJoin, map } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { FormModel } from 'src/app/shared/interfaces/models/form.model';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { FormService } from 'src/app/shared/services/form.service';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TranslateService } from '@ngx-translate/core';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';
import { fileUploadMode } from 'src/core/cdk/file-upload/file-upload.component';

@Component({
  selector: 'app-create-form-modal',
  templateUrl: './create-form-modal.component.html',
  styleUrls: ['./create-form-modal.component.scss'],
  providers: [provideNgxMask(), MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class CreateFormModalComponent implements OnInit {
  form!: FormGroup;
  fileUploadMode = fileUploadMode;
  title = '';
  insurers: DropdownOption[] = [];
  tenants: DropdownOption[] = [];
  policyTypes: DropdownOption[] = [];
  isAdmin = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: {
      policy_type?: PopulatedPolicyTypeModel;
      form?: FormModel;
      isAdmin?: boolean;
    },
    private _dialog: MatDialogRef<CreateFormModalComponent>,
    private _ui: UiService,
    private _forms: FormService,
    private _insurers: InsurerConfigService,
    private _tenants: TenantsService,
    private _dataset: DatasetsService,
    private _t: TranslateService
  ) {
    this.isAdmin = !!this._data.isAdmin;

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      insurer_ids: new FormControl('', Validators.required),
      form_document: new FormControl(null, [Validators.required]),
      ...(this.isAdmin && {
        tenant_ids: new FormControl([]),
        policy_type_id: new FormControl('', Validators.required),
      }),
    });

    this.title = this._data.form
      ? this._t.instant('PORTAL.FORMS.TITLE_EDIT')
      : this._t.instant('PORTAL.FORMS.TITLE_CREATE');
  }

  ngOnInit(): void {
    this._ui.showLoader();

    const requests: any[] = [
      this._insurers.getInsurers(0, 1000).pipe(map(r => r.records)),
    ];

    if (this.isAdmin) {
      requests.push(
        this._tenants
          .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
          .pipe(map(r => r.records))
      );
      requests.push(this._dataset.getAllPolicyTypes());
    }

    forkJoin(requests)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(([insurerList, tenantList, policyTypeList]: any[]) => {
        this.insurers = [
          { code: '', name: 'All' },
          ...insurerList.map((i: InsurerModel) => ({ code: i._id, name: i.name })),
        ];

        if (tenantList) {
          this.tenants = tenantList.map((t: any) => ({
            code: t._id,
            name: `${t.name} (${t.code})`,
          }));
        }

        if (policyTypeList) {
          this.policyTypes = policyTypeList.map((pt: PopulatedPolicyTypeModel) => ({
            code: pt._id,
            name: pt.name,
          }));
        }

        this._fillForm();
      });
  }

  private _fillForm() {
    if (this._data.form) {
      this.form.patchValue({
        name: this._data.form.name,
        insurer_ids: this._data.form.insurer_ids,
        form_document: this._data.form.form_document,
        ...(this.isAdmin && {
          tenant_ids: this._data.form.tenant_ids ?? [],
          policy_type_id: this._data.form.policy_type_id ?? '',
        }),
      });
      // In edit mode the document already exists — re-upload is optional
      this.form.get('form_document')?.clearValidators();
      this.form.get('form_document')?.updateValueAndValidity();
    }
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }

  submitForm(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const insurerIds = this.form.value.insurer_ids;
    const policyTypeId = this.isAdmin
      ? this.form.value.policy_type_id
      : this._data.policy_type!._id;

    const payload = {
      ...this.form.value,
      policy_type_id: policyTypeId,
      insurer_ids:
        Array.isArray(insurerIds) && insurerIds[0] === ''
          ? this.insurers.slice(1).map(i => i.code)
          : insurerIds,
    };

    this._ui.showLoader();
    if (!this._data.form) {
      this._forms
        .newForm(payload)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(() => {
          this.form.reset();
          this._openSuccessModal();
        });
    } else {
      this._forms
        .updateForm(this._data.form._id, payload)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(() => {
          this.form.reset();
          this._openSuccessModal();
        });
    }
  }

  private _openSuccessModal() {
    this._ui
      .showInformationModal({
        text: this._t.instant('PORTAL.FORMS.UPDATED_SUCCESS_TEXT'),
        title: this._t.instant('PORTAL.FORMS.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe(() => {
        this.close(true);
      });
  }
}
