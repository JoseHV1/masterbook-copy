import { Component, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { hasError } from '@app/shared/helpers/has-error.helper.ts';
import { isInvalid } from '@app/shared/helpers/is-invalid.helper';
import { youtubeLinkValidator } from '@app/shared/helpers/mymasterbook-validator';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { CreateHowToRequest } from '@app/shared/interfaces/requests/how-to/create-request.request';
import { UpdateHowToRequest } from '@app/shared/interfaces/requests/how-to/update-how-to.request';
import { HowToService } from '@app/shared/services/how-to.service';
import { finalize } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-form-new-how-to',
  templateUrl: './form-new-how-to.component.html',
  styleUrls: ['./form-new-how-to.component.scss'],
})
export class FormNewHowToComponent implements OnChanges {
  @Input() howTo?: HowToModel;
  form!: FormGroup;

  isInvalid = isInvalid;
  hasError = hasError;

  constructor(
    private _howTo: HowToService,
    private _ui: UiService,
    private _router: Router
  ) {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.howTo) this.form.patchValue(this.howTo);
  }

  initForm(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      description: new FormControl(null),
      video: new FormControl(null, [
        Validators.required,
        youtubeLinkValidator(),
      ]),
    });
  }

  send() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.howTo ? this._editData() : this._saveData();
  }

  private _saveData() {
    const req = this.form.value as CreateHowToRequest;
    this._ui.showLoader();
    this._howTo
      .createHowTo(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(howTo => {
        this._reset();
        this._openSuccessModal(howTo, 'created');
      });
  }

  private _editData() {
    const req = this.form.value as UpdateHowToRequest;
    this._ui.showLoader();
    this._howTo
      .editHowTo(req, this.howTo?._id ?? '')
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(howTo => {
        this._reset();
        this._openSuccessModal(howTo, 'updated');
      });
  }

  private _reset(): void {
    this.form.reset();
  }

  private _openSuccessModal(data: HowToModel, action: 'created' | 'updated') {
    const message = `The video {{link}} has been ${action} successfully.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: `#${data.serial}`,
          url: ['/portal-admin/how-to', data.serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal-admin/how-to']);
        }
      });
  }

  cancelForm() {
    this._router.navigate(['/portal-admin/how-to']);
  }
}
