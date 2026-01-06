import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UiService } from 'src/app/shared/services/ui.service';
import { finalize, take } from 'rxjs';
import { GenderEnum } from '../../../../shared/enums/gender.enum';
import { NewBrokerRolesEnum } from 'src/app/shared/enums/roles.enum';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { UserService } from 'src/app/shared/services/user.service';
import { enumToDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { CreateBrokerRequest } from 'src/app/shared/interfaces/requests/broker/create-broker.request';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { UpdateBrokerRequest } from 'src/app/shared/interfaces/requests/broker/update-broker.request.js';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';

@Component({
  selector: 'app-form-users',
  templateUrl: './form-users.component.html',
  styleUrls: ['./form-users.component.scss'],
})
export class FormUsersComponent implements OnInit, OnChanges {
  @Input() data?: PopulatedBrokerModel;
  form!: FormGroup;
  maxDate: Date = new Date();
  today: Date = new Date();
  dropDownUserTypes = enumToDropDown(NewBrokerRolesEnum);
  businessLineOptions: DropdownOptionModel[] = [];
  dropDownGender = enumToDropDown(GenderEnum);

  constructor(
    private _router: Router,
    private _ui: UiService,
    private _user: UserService,
    private _dataset: DatasetsService
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
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
      license_number: new FormControl('', Validators.required),
      license_expires_at: new FormControl('', Validators.required),
      date_of_birth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this._ui.showLoader();
    this._dataset
      .getBusinessLinesDataset()
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
    const action = this.data ? 'edit' : 'create';
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
        text: `Are you sure you want to ${action} this user? This action will generate an additional recharge of $${userCost} per month`,
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
      ? `The user {{link}} has been updated successfully`
      : `The user {{link}} has been created successfully. Your new agent will receive an email with login details and further instructions to access their account.`;

    this._ui
      .showInformationModal({
        text: message,
        title: 'SUCCESS!',
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
