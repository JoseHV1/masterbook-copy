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
        text: 'Are you sure you want to submit your information?',
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
          this._ui.showAlertError('Your information could not be submitted. Please try again later.');
        },
      });
  }

  private _openSuccessModal(): void {
    this._ui
      .showInformationModal({
        text: 'Thank you! Your information has been received. One of our specialists will contact you soon.',
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
