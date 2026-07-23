import { Component, Input, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, Subscription, take } from 'rxjs';
import { GenderEnum } from '../../../../shared/enums/gender.enum';
import { NewBrokerRolesEnum } from 'src/app/shared/enums/roles.enum';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { UserService } from 'src/app/shared/services/user.service';
import { enumToTranslatedDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { CreateBrokerRequest } from 'src/app/shared/interfaces/requests/broker/create-broker.request';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { UpdateBrokerRequest } from 'src/app/shared/interfaces/requests/broker/update-broker.request.js';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
})
export class FormUsersComponent implements OnInit, OnChanges, OnDestroy {
  @Input() data?: PopulatedBrokerModel;
  form!: FormGroup;
  maxDate: Date = new Date();
  minDate: Date = new Date();
  today: Date = new Date();
  maxLicenseExpirationDate: Date = new Date(
    this.today.getFullYear() + 20,
    this.today.getMonth(),
    this.today.getDate()
  );
  dropDownUserTypes: DropdownOptionModel[] = [];
  businessLineOptions: DropdownOptionModel[] = [];
  dropDownGender: DropdownOptionModel[] = [];

  private _langChangeSub!: Subscription;

  constructor(
    private _router: Router,
    private _ui: UiService,
    private _user: UserService,
    private _dataset: DatasetsService,
    private _t: TranslateService,
  ) {
    this._buildGenderOptions();
    this._buildUserTypeOptions();
    this._langChangeSub = this._t.onLangChange.subscribe(() => {
      this._buildGenderOptions();
      this._buildUserTypeOptions();
    });
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    this.minDate.setFullYear(this.minDate.getFullYear() - 100);
    this.form = new FormGroup({
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(MyMasterbookValidators.emailPattern),
      ]),
      phone_number: new FormControl('', Validators.required),
      business_lines: new FormControl('', Validators.required),
      license_number: new FormControl('', [
        Validators.required,
        Validators.maxLength(15),
      ]),
      license_expires_at: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });
  }

  private _buildGenderOptions(): void {
    this.dropDownGender = enumToTranslatedDropDown(GenderEnum, 'ENUMS.GENDER', this._t);
  }

  private _buildUserTypeOptions(): void {
    this.dropDownUserTypes = enumToTranslatedDropDown(
      NewBrokerRolesEnum,
      'ENUMS.NEW_BROKER_ROLE',
      this._t
    );
  }

  ngOnDestroy(): void {
    this._langChangeSub?.unsubscribe();
  }

  ngOnInit(): void {
    this._ui.showLoader();
    this._dataset
      .getBusinessLinesListDataset()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(lines => {
        this.businessLineOptions = lines.map(line => ({
          name: line.name,
          code: line._id,
        }));
      });
  }

  ngOnChanges(): void {
    if (this.data) {
      this.form.patchValue({ ...this.data, ...this.data.user });
      this.form.get('email')?.disable();
    } else {
      this.form.get('email')?.enable();
    }
  }

  cancelForm() {
    this._router.navigate(['/portal/users']);
  }

  openConfirmationModal() {
    const confirmKey = this.data ? 'PORTAL.USERS.CONFIRM_EDIT' : 'PORTAL.USERS.CONFIRM_CREATE';
    const role = this.form.get('role')?.value;

    let userCost = 0;
    switch (role) {
      case NewBrokerRolesEnum.AGENCY_ADMINISTRATOR:
        userCost = 5;
        break;
      case NewBrokerRolesEnum.AGENCY_BROKER:
        userCost = 3;
        break;
      default:
        break;
    }

    this._ui
      .showConfirmationModal({
        text: this._t.instant(confirmKey, { cost: userCost }),
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this.sendForm();
      });
  }

  sendForm() {
    this.form.markAsDirty();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this._ui.showLoader();
    if (!this.data) {
      const req = this.form.value as CreateBrokerRequest;
      this._user
        .createUser(req)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this.form.reset();
          this._openSuccessModal(resp);
        });
    } else {
      const req = this.form.value as UpdateBrokerRequest;
      this._user
        .updateUser(this.data._id, req)
        .pipe(finalize(() => this._ui.hideLoader()))
        .subscribe(resp => {
          this._openSuccessModal(resp);
        });
    }
  }

  private _openSuccessModal(user: PopulatedBrokerModel) {
    const fullname = `${user.user?.first_name ?? ''} ${user.user?.last_name}`;
    const message = this.data
      ? this._t.instant('PORTAL.USERS.UPDATED_SUCCESS_TEXT')
      : this._t.instant('PORTAL.USERS.CREATED_SUCCESS_TEXT');

    this._ui
      .showInformationModal({
        text: message,
        title: this._t.instant('PORTAL.USERS.SUCCESS_TITLE'),
        type: UiModalTypeEnum.SUCCESS,
        link: {
          name: fullname,
          url: ['/portal/users', user.serial],
        },
      })
      .subscribe(result => {
        if (result != 'link') {
          this._router.navigate(['/portal/users']);
        }
      });
  }
}
