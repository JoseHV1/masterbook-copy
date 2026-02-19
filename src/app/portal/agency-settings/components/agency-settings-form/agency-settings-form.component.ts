import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatasetsService } from '@app/shared/services/dataset.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { catchError, EMPTY, finalize, retry, switchMap } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { AgencyModel } from 'src/app/shared/interfaces/models/agency.model';
import { EditAgencySettingsRequest } from 'src/app/shared/interfaces/requests/agencies/edit-agency-settings.request';
import { AgencySettingsService } from 'src/app/shared/services/agency-settings.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { isInvalid } from 'src/app/shared/helpers/is-invalid.helper';
import { hasError } from 'src/app/shared/helpers/has-error.helper.ts';

@Component({
  selector: 'app-agency-settings-form',
  templateUrl: './agency-settings-form.component.html',
  styleUrls: ['./agency-settings-form.component.scss'],
})
export class AgencySettingsFormComponent implements OnInit {
  form!: FormGroup;
  dataAgency!: AgencyModel;
  logo?: string;
  businessLines: BusinessLineModel[] = [];

  isInvalid = isInvalid;
  hasError = hasError;

  constructor(
    private _ui: UiService,
    private _agencySettings: AgencySettingsService,
    private _uploadFile: UploadFileService,
    private _datasets: DatasetsService,
  ) { }

  ngOnInit(): void {
    this._ui.showLoader();
    this.form = this._agencySettings.createEditSettingsForm();

    this._datasets.getBusinessLinesDataset().pipe(
      retry(2),
      catchError(error => {
        this._ui.showAlertError('Error loading business lines');
        return EMPTY;
      }),
      switchMap(lines => {
        this.businessLines = lines;
        return this._agencySettings.getAgencySettings().pipe(
          retry(2),
          catchError(error => {
            this._ui.showAlertError('Error loading agency settings');
            return EMPTY;
          })
        );
      }),
      finalize(() => this._ui.hideLoader())
    ).subscribe(agency => {
      this.dataAgency = agency;
      this.fillData(agency);

      if (this.dataAgency.logo_url) {
        this._uploadFile.getUrlFile(this.dataAgency.logo_url).subscribe(url => {
          this.logo = '/assets/images/portal/image_default.webp';
        });
      } else {
        this.logo = '/assets/images/portal/image_default.webp';
      }
    });
  }

  fillData(agency: AgencyModel) {
    const selectedLines = this.businessLines.filter(line =>
      agency.business_lines.includes(line._id)
    );

    const selectedIds = selectedLines.map(line => line._id);

    this.form.patchValue({
      retentions: agency.retentions,
      taxes: agency.taxes,
      business_lines_ids: selectedIds,
    });
  }

  addImage(img: string, field: string): void {
    this.form.controls[field].patchValue(img);
  }

  send() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const req: EditAgencySettingsRequest = {
      retentions: this.form.value.retentions ?? null,
      taxes: this.form.value.taxes ?? null,
      logo_image: this.form.value.logo_image ?? undefined,
      business_lines: this.form.value.business_lines_ids || [],
      check_branding: !!(
        (this.form.value.check_brand_publication as Array<string>) ?? []
      ).length,
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
