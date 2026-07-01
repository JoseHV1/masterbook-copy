import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { UiService } from 'src/app/shared/services/ui.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { CreateLeadRequest } from 'src/app/portal/leads/interfaces/requests/create-lead.request';
import { CaptureMediumEnum } from 'src/app/portal/leads/enums/capture-medium.enum';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-agency-lead',
  templateUrl: './form-agency-lead.component.html',
  styleUrls: ['./form-agency-lead.component.scss'],
})
export class FormAgencyLeadComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private submitting = false;
  private token = '';

  dropDownCaptureMedium: DropdownOptionModel[] = enumToDropDown(CaptureMediumEnum);

  form = new FormGroup({
    first_name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    last_name: new FormControl<string | null>(null, [
      Validators.required,
      Validators.maxLength(50),
    ]),
    email: new FormControl<string | null>(null, [
      Validators.required,
      Validators.pattern(MyMasterbookValidators.emailPattern),
    ]),
    capture_medium: new FormControl<string | null>(null, [Validators.required]),
  });

  constructor(
    private _leads: LeadsService,
    private _route: ActivatedRoute,
    private _ui: UiService,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    this.token = this._route.snapshot.params['token'] ?? '';
    const social = this._route.snapshot.params['social'] ?? '';
    if (social) {
      this.form.patchValue({ capture_medium: social.toUpperCase() });
    }
  }

  cancelForm(): void {
    this.form.reset();
  }

  openConfirmationModal(): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('ANON.LEADS.CONFIRM_SUBMIT'),
      })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((confirmed: boolean) => {
        if (confirmed) this.sendForm();
      });
  }

  sendForm(): void {
    if (this.submitting) return;
    this.submitting = true;

    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    this._ui.showLoader();

    const req = {
      first_name: this.form.value.first_name!,
      last_name: this.form.value.last_name!,
      email: this.form.value.email!,
      capture_medium: this.form.value.capture_medium!,
    } as unknown as CreateLeadRequest;

    this._leads
      .createLead(req, this.token)
      .pipe(
        finalize(() => {
          this.submitting = false;
          this._ui.hideLoader();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.form.reset();
          this._openSuccessModal();
        },
        error: () => {
          this._ui.showAlertError(this._t.instant('ANON.LEADS.AGENCY_SUBMIT_ERROR'));
        },
      });
  }

  private _openSuccessModal(): void {
    this._ui
      .showInformationModal({
        text: this._t.instant('ANON.LEADS.AGENCY_SUCCESS_TEXT'),
        title: this._t.instant('ANON.LEADS.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
