import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take } from 'rxjs';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { LeadsService } from '../services/leads.service';
import { LeadModel } from '../interfaces/lead.model';
import { LeadStatusEnum } from '../enums/lead-status.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';

@Component({
  selector: 'app-convert-lead',
  templateUrl: './convert-lead.component.html',
  styleUrls: ['./convert-lead.component.scss'],
})
export class ConvertLeadComponent {
  private serial = '';
  lead?: LeadModel;
  LeadStatusEnum = LeadStatusEnum;
  showAgentSelector = false;
  today = new Date();
  dropDownMaritalStatus: DropdownOptionModel[] = enumToDropDown(MaritalStatusEnum);

  form = new FormGroup({
    account_name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(30),
    ]),
    ssn: new FormControl<string | null>(null, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4),
    ]),
    date_of_birth: new FormControl<string | null>(null, [Validators.required]),
    marital_status: new FormControl<string | null>(null, [Validators.required]),
    phone_extension: new FormControl<string | null>(null, [Validators.maxLength(4)]),
    broker_id: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(
    private _route: ActivatedRoute,
    private _leads: LeadsService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _auth: AuthService,
  ) {
    this.showAgentSelector = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role as RolesEnum
    );
    if (!this.showAgentSelector) {
      this.form.get('broker_id')?.setValidators(null);
      this.form.get('broker_id')?.disable();
    }
    this._ui.showLoader();
    this._route.params
      .pipe(
        take(1),
        switchMap(params => {
          const serial = params['serial'];
          if (!serial) throw new Error();
          this.serial = serial;
          return this._leads.getLeadBySerial(serial);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: lead => {
          this.lead = lead;
          this.form.patchValue({
            account_name: `${lead.first_name} ${lead.last_name}`,
          });
        },
        error: () => {
          this._ui.showAlertError('Lead not found.');
          this._router.navigateByUrl('portal/leads');
        },
      });
  }

  submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this._ui
      .showConfirmationModal({
        text: 'Are you sure you want to convert this lead into an account? This action cannot be undone.',
        type: UiModalTypeEnum.WARNING,
      })
      .pipe(take(1))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this._executeConvert();
      });
  }

  private _executeConvert(): void {
    this._ui.showLoader();
    this._leads
      .convertLead(this.serial, this.form.value as any)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui
            .showInformationModal({
              title: 'SUCCESS!',
              text: 'The account has been created successfully. Your client will receive an email with login details.',
              type: UiModalTypeEnum.SUCCESS,
            })
            .pipe(take(1))
            .subscribe(() => this._router.navigateByUrl('portal/leads'));
        },
        error: () => this._ui.showAlertError('Could not convert the lead. Please try again.'),
      });
  }

  goBack(): void {
    this._location.back();
  }
}
