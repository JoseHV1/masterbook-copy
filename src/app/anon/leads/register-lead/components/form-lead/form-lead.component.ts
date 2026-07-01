import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { UiService } from 'src/app/shared/services/ui.service';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { NormalizeTextPipe } from 'src/app/shared/pipes/normalize-text.pipe';
import { LeadsService } from 'src/app/portal/leads/services/leads.service';
import { CreateLeadRequest } from 'src/app/portal/leads/interfaces/requests/create-lead.request';
import { LeadTokenInfoModel } from 'src/app/portal/leads/interfaces/lead-token-info.model';
import { AreaOfInterestEnum } from 'src/app/portal/leads/enums/area-of-interest.enum';
import { TranslateService } from '@ngx-translate/core';

const OTHER_CAPTURE_MEDIUM = 'OTHER';

@Component({
  selector: 'app-form-lead',
  templateUrl: './form-lead.component.html',
  styleUrls: ['./form-lead.component.scss'],
  providers: [NormalizeTextPipe],
})
export class FormLeadComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();

  form!: FormGroup;
  dropDownGender: DropdownOptionModel[] = enumToDropDown(GenderEnum);
  dropDownCaptureMedium: DropdownOptionModel[] = [];
  areasOfInterestOptions: DropdownOptionModel[] = Object.values(AreaOfInterestEnum).map(v => ({
    code: v,
    name: v,
  }));
  invalidToken = false;
  loadingTokenInfo = true;
  leadInfo: LeadTokenInfoModel | null = null;

  @Output() logoUrl = new EventEmitter<string | null>();

  readonly OTHER_CAPTURE_MEDIUM = OTHER_CAPTURE_MEDIUM;

  private token: string | null = null;
  private submitting = false;

  constructor(
    private _leads: LeadsService,
    private _route: ActivatedRoute,
    private _ui: UiService,
    private _normalizeText: NormalizeTextPipe,
    private _t: TranslateService,
  ) {
    this._initForm();
  }

  ngOnInit(): void {
    this.token = this._route.snapshot.params['token'] ?? null;
    const social: string | null = this._route.snapshot.params['social'] ?? null;

    if (social) {
      this.form.patchValue({ capture_medium: social.toUpperCase() });
    }

    if (!this.token) {
      this.invalidToken = true;
      this.loadingTokenInfo = false;
      this._ui.showAlertError(this._t.instant('ANON.LEADS.INVALID_TOKEN'));
      return;
    }

    this._ui.showLoader();

    this._leads
      .getLeadByToken(this.token)
      .pipe(
        finalize(() => {
          this.loadingTokenInfo = false;
          this._ui.hideLoader();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: info => {
          this.leadInfo = info;
          this.logoUrl.emit(info.logo_url);
          this.dropDownCaptureMedium = info.capture_medium_options.map(option => ({
            code: option,
            name: this._normalizeText.transform(option),
          }));
        },
        error: () => {
          this.invalidToken = true;
          this._ui.showAlertError(this._t.instant('ANON.LEADS.INVALID_TOKEN'));
        },
      });
  }

  private _initForm() {
    this.form = new FormGroup({
      first_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(12),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(MyMasterbookValidators.emailPattern),
      ]),
      email_confirmation: new FormControl(null, []),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      address: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
      gender: new FormControl(null, [Validators.required]),
      capture_medium: new FormControl(null, [Validators.required]),
      other_capture_medium: new FormControl(null, []),
      areas_of_interest: new FormControl([], [Validators.required, Validators.minLength(1)]),
      notes: new FormControl(null, [Validators.maxLength(500)]),
    });

    this._setEmailConfirmationValidator();
    this._setOtherCaptureMediumValidator();
  }

  private _setEmailConfirmationValidator() {
    const emailControl = this.form.get('email');
    const emailConfirmationControl = this.form.get('email_confirmation');

    emailControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        emailConfirmationControl?.setValidators([
          Validators.required,
          Validators.pattern(MyMasterbookValidators.emailPattern),
          MyMasterbookValidators.equals(value),
        ]);
        emailConfirmationControl?.updateValueAndValidity();
      });
  }

  private _setOtherCaptureMediumValidator() {
    const captureMediumControl = this.form.get('capture_medium');
    const otherControl = this.form.get('other_capture_medium');

    captureMediumControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        if (value === OTHER_CAPTURE_MEDIUM) {
          otherControl?.setValidators([Validators.required]);
        } else {
          otherControl?.setValidators(null);
          otherControl?.reset(null, { emitEvent: false });
        }
        otherControl?.updateValueAndValidity();
      });
  }

  get isOtherCaptureMedium(): boolean {
    return this.form.get('capture_medium')?.value === OTHER_CAPTURE_MEDIUM;
  }

  cancelForm() {
    this.form.reset({}, { emitEvent: false });
  }

  openConfirmationModal() {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('ANON.LEADS.CONFIRM_SUBMIT_LEAD'),
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this.sendForm();
      });
  }

  sendForm() {
    if (this.submitting) return;
    this.submitting = true;

    this.form.markAsDirty();
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.submitting = false;
      return;
    }

    this._ui.showLoader();

    const req = this._getDataAsRequest();

    this._leads
      .createLead(req, this.token!)
      .pipe(
        finalize(() => {
          this.submitting = false;
          this._ui.hideLoader();
        })
      )
      .subscribe({
        next: () => {
          this.form.reset({}, { emitEvent: false });
          this._openSuccessModal();
        },
        error: () => {
          this._ui.showAlertError(
            this._t.instant('ANON.LEADS.CREATE_ERROR')
          );
        },
      });
  }

  private _getDataAsRequest(): CreateLeadRequest {
    const req: CreateLeadRequest = {
      first_name: this.form.value.first_name,
      last_name: this.form.value.last_name,
      email: this.form.value.email,
      phone_number: this.form.value.phone_number,
      gender: this.form.value.gender,
      capture_medium: this.form.value.capture_medium,
      areas_of_interest: this.form.value.areas_of_interest ?? [],
      address_info: {
        ...this.form.value.address,
        zipcode: this.form.value.zipcode ?? '',
      },
    };

    if (this.form.value.notes) {
      req.notes = this.form.value.notes;
    }

    if (this.form.value.other_capture_medium) {
      req.other_capture_medium = this.form.value.other_capture_medium;
    }

    return req;
  }

  private _openSuccessModal() {
    this._ui
      .showInformationModal({
        text: this._t.instant('ANON.LEADS.SUCCESS_TEXT'),
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
