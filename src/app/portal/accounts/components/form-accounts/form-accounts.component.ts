import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { addZero } from 'src/app/shared/helpers/add-zero';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AccountsService } from '../../../../shared/services/accounts.service';
import { finalize, Subject, take, takeUntil } from 'rxjs';
import { MaritalStatusEnum } from 'src/app/shared/enums/marital-status.enum';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { Location } from '@angular/common';
import { CreateAccountRequest } from 'src/app/shared/interfaces/requests/accounts/create-account.request';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { UpdateAccountRequest } from 'src/app/shared/interfaces/requests/accounts/update-account.request';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { AccountStatusEnum } from 'src/app/shared/enums/account-status.enum';

@Component({
  selector: 'app-form-accounts',
  templateUrl: './form-accounts.component.html',
  styleUrls: ['./form-accounts.component.scss'],
})
export class FormAccountsComponent implements OnChanges, OnDestroy {
  @Input() data?: PopulatedAccount;
  private destroy$: Subject<void> = new Subject();

  form!: FormGroup;
  showAgentSelector = false;
  dropDownMaritalStatus: DropdownOptionModel[] =
    enumToDropDown(MaritalStatusEnum);
  dropDownGender: DropdownOptionModel[] = enumToDropDown(GenderEnum);
  dropDownStatus: DropdownOptionModel[] = enumToDropDown(AccountStatusEnum);

  addZero = addZero;
  today = new Date();

  private submitting = false;

  constructor(
    private _accounts: AccountsService,
    private _router: Router,
    private _ui: UiService,
    private _auth: AuthService,
    private _location: Location
  ) {
    this.showAgentSelector = brokersAdminDataset.includes(
      this._auth.getAuth()?.user?.role as RolesEnum
    );
    this._initForm();
  }

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue({
        ...this.data,
        ...this.data.user,
        address: this.data.user?.address_info ?? null,
        zipcode: this.data.user?.address_info?.zipcode ?? '',
        additional_address_information:
          this.data.user?.address_info?.additional_address ?? '',
      });

      this._updateValidator();
    }
  }

  private _initForm() {
    this.form = new FormGroup({
      account_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      first_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(12),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      ssn: new FormControl(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(MyMasterbookValidators.emailPattern),
      ]),
      email_confirmation: new FormControl(null, []),
      status: new FormControl({ value: null, disabled: true }, []),
      phone_number: new FormControl(null, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
      phone_extension: new FormControl(null, [Validators.maxLength(4)]),
      address: new FormControl(null, [Validators.required]),
      zipcode: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
      ]),
      additional_address_information: new FormControl(null, [
        Validators.maxLength(60),
      ]),
      broker_id: new FormControl(null, [Validators.required]),
      gender: new FormControl(null, [Validators.required]),
      date_of_birth: new FormControl(null, [Validators.required]),
      marital_status: new FormControl(null, [Validators.required]),
    });

    if (!this.showAgentSelector) {
      this.form.get('broker_id')?.setValidators(null);
      this.form.get('broker_id')?.disable();
    }

    this._updateValidator();
  }

  private _updateValidator() {
    const statusControl = this.form.get('status');
    const emailControl = this.form.get('email');
    const emailConfirmationControl = this.form.get('email_confirmation');
    if (this.data) {
      statusControl?.setValidators([Validators.required]);
      statusControl?.enable();

      emailControl?.disable();
      emailConfirmationControl?.setValidators(null);
      emailConfirmationControl?.disable();
      return;
    }

    emailControl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        emailConfirmationControl?.setValidators([
          Validators.required,
          Validators.pattern(MyMasterbookValidators.emailPattern),
          MyMasterbookValidators.equals(value),
        ]);
      });
  }

  cancelForm() {
    this._location.back();
  }

  openConfirmationModal() {
    const action = this.data ? 'edit' : 'save';

    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to ${action} this account?`,
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

    const req = this._getDataAsRequest() as CreateAccountRequest;

    this._accounts
      .createAccount(req)
      .pipe(
        finalize(() => {
          this.submitting = false;
          this._ui.hideLoader();
        })
      )
      .subscribe(account => {
        this.form.reset();
        this._openSuccessModal(account);
      });
  }

  private _getDataAsRequest() {
    const req = {
      ...this.form.value,
      address_info: {
        ...this.form.value.address,
        zipcode: this.form.value.zipcode ?? '',
        additional_address:
          this.form.value.additional_address_information ?? '',
      },
    };
    delete req.address;
    delete req.additional_address_information;
    delete req.zipcode;
    delete req.email_confirmation;
    return req;
  }

  private _openSuccessModal(account: PopulatedAccount) {
    const clientName = this.form.value.account_name;
    const message = this.data
      ? `The account {{link}} has been updated successfully`
      : `The account for {{link}} has been created successfully. Your client will receive an email with login details and further instructions to access their account.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: clientName,
          url: ['/portal/accounts', account.serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/accounts']);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
