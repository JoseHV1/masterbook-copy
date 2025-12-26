import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { AgencyModel } from 'src/app/shared/interfaces/models/agency.model';
import { EditAgencySettingsRequest } from 'src/app/shared/interfaces/requests/agencies/edit-agency-settings.request';
import { AgencySettingsService } from 'src/app/shared/services/agency-settings.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-agency-settings-form',
  templateUrl: './agency-settings-form.component.html',
  styleUrls: ['./agency-settings-form.component.scss'],
})
export class AgencySettingsFormComponent implements OnInit {
  form!: FormGroup;
  dataAgency!: AgencyModel;

  constructor(
    private _ui: UiService,
    private _agencySettings: AgencySettingsService
  ) {
    this.form = this._agencySettings.createEditSettingsForm();
  }

  ngOnInit(): void {
    this._agencySettings.getAgencySettings().subscribe(resp => {
      this.dataAgency = resp;
      this.fillData(resp);
    });
  }

  fillData(agency: AgencyModel) {
    this.form.patchValue({
      retentions: agency.retentions,
      taxes: agency.taxes,
    });
  }

  send() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const req: EditAgencySettingsRequest = {
      retentions: this.form.value.retentions ?? null,
      taxes: this.form.value.taxes ?? null,
    };

    this._ui.showLoader();

    this._agencySettings
      .editAgencySetting(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._openSuccessModal();
      });
  }

  private _openSuccessModal() {
    const message = `The agency settings has been updated successfully`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe(() => {
        this._ui.showAlertSuccess('Profile updated successfully');
      });
  }
}
