import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { provideNgxMask } from 'ngx-mask';
import { finalize, map } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { FormModel } from 'src/app/shared/interfaces/models/form.model';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { FormService } from 'src/app/shared/services/form.service';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';
import { fileUploadMode } from 'src/core/cdk/file-upload/file-upload.component';
@Component({
  selector: 'app-create-form-modal',
  templateUrl: './create-form-modal.component.html',
  styleUrls: ['./create-form-modal.component.scss'],
  providers: [provideNgxMask(), MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class CreateFormModalComponent {
  form!: FormGroup;
  fileUploadMode = fileUploadMode;
  title = '';
  insurers: DropdownOption[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy_type: PopulatedPolicyTypeModel; form?: FormModel },
    private _dialog: MatDialogRef<CreateFormModalComponent>,
    private _ui: UiService,
    private _forms: FormService,
    private _insurers: InsurerConfigService
  ) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      insurer_ids: new FormControl('', Validators.required),
      form_document: new FormControl(null, [Validators.required]),
    });
    this.title = this._data.form ? 'Edit form' : 'Create form';
    this._fillForm();
    this._loadInsurers();
  }

  private _fillForm() {
    if (this._data.form) {
      this.form.patchValue(this._data.form);
    }
  }

  private _loadInsurers() {
    this._ui.showLoader();
    this._insurers
      .getInsurers(0, 1000)
      .pipe(
        map(resp => resp.records),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe((resp: InsurerModel[]) => {
        this.insurers = resp.map(insurer => ({
          code: insurer._id,
          name: insurer.name,
        }));
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }

  submitForm(): void {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      policy_type_id: this._data.policy_type._id,
    };

    this._ui.showLoader();
    if (!this._data.form) {
      this._forms
        .newForm(payload)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this.form.reset();
          this._openSuccessModal(resp);
        });
    } else {
      this._forms
        .updateForm(this._data.form._id, payload)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this.form.reset();
          this._openSuccessModal(resp);
        });
    }
  }

  private _openSuccessModal(form: FormModel) {
    const message = this._data.form
      ? `The form has been updated successfully`
      : `The form <a href="/portal/request-forms/${form._id}" style="color: #007bff; text-decoration: underline;">${form.name}</a> has been created successfully`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe(() => {
        this.close(true);
      });
  }
}
