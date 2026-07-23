import { ChangeDetectorRef, Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../shared/services/auth.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { finalize } from 'rxjs';
import { UrlService } from 'src/app/shared/services/url.service';
import { PopulatedUserModel } from 'src/app/shared/interfaces/models/user.model';
import { FormGroup, Validators } from '@angular/forms';
import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';
import { enumToTranslatedDropDown } from 'src/app/shared/helpers/enum-to-dropdown.helper';
import { GenderEnum } from 'src/app/shared/enums/gender.enum';
import { EditProfileRequest } from 'src/app/shared/interfaces/requests/profile/edit-profile.request';
import { AddressAutocompleteModel } from 'src/app/shared/models/address-autocomplete.model';
import { MatDialog } from '@angular/material/dialog';
import { ModalChangePasswordComponent } from '../modal-change-password/modal-change-password.component';
import { switchMap } from 'rxjs/operators';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { IntegrationsService } from '@app/shared/services/integration.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

type FakeGoogleConnection = {
  email: string;
  name?: string;
  connectedAt: string; // ISO string
};

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.scss'],
})
export class ProfileFormComponent implements OnInit, OnDestroy {
  @ViewChild('fileInput') fileInput: any;

  form!: FormGroup;
  dataUser!: PopulatedUserModel;
  dropDownGender: DropdownOptionModel[] = [];
  today: Date = new Date();
  isEditing: boolean = false;
  imageProfile!: string;
  googleConnection: FakeGoogleConnection | null = null;
  private readonly GOOGLE_STORAGE_KEY = 'masterbook_google_connection';
  private _langChangeSub!: Subscription;

  constructor(
    private _auth: AuthService,
    private _ui: UiService,
    private _profile: ProfileService,
    public _url: UrlService,
    private _cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private _uploadFile: UploadFileService,
    private _integrations: IntegrationsService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _t: TranslateService,
  ) {
    this._buildGenderOptions();
    this._langChangeSub = this._t.onLangChange.subscribe(() => this._buildGenderOptions());
    this.form = this._profile.createEditProfileForm();
  }

  private _buildGenderOptions(): void {
    this.dropDownGender = enumToTranslatedDropDown(GenderEnum, 'ENUMS.GENDER', this._t);
  }

  ngOnDestroy(): void {
    this._langChangeSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.dataUser = this._auth.getAuth()?.user as PopulatedUserModel;
    this.fillData(this.dataUser);
    this.form.disable();

    if (this.dataUser.photo_url) {
      this._uploadFile.getUrlFile(this.dataUser.photo_url).subscribe(url => {
        this.imageProfile = url;
      });
    } else {
      this.imageProfile = '/assets/images/portal/image_default.webp';
    }

    this._profile.getGoogleStatus().subscribe({
      next: status => {
        if (status.google?.connected) {
          this.googleConnection = {
            email: status.google.email ?? '',
            connectedAt: new Date().toISOString(),
          };
        } else {
          this.googleConnection = null;
        }

        this._cd.detectChanges();
      },
      error: err => {
        this.googleConnection = null;
      },
    });

    const googleAuth = this._activatedRoute.snapshot.queryParamMap.get('google_auth');
    if (googleAuth === 'success') {
      this._ui.showAlertSuccess(this._t.instant('PORTAL.PROFILE_FORM.GOOGLE_CONNECTED'));
      this._router.navigate([], {
        queryParams: { google_auth: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }

    this.form
      .get('allow_expiring_policies_notifications')
      ?.valueChanges.subscribe(value => {
        const dayControl = this.form.get(
          'days_expiring_policies_notifications'
        );

        if (value === true) {
          dayControl?.setValidators([Validators.required]);
          dayControl?.updateValueAndValidity();
        } else {
          dayControl?.setValue(null, { emitEvent: false });
          dayControl?.clearValidators();
          dayControl?.updateValueAndValidity();
        }
      });
  }

  connectGoogle(): void {
    const returnTo = this._router.url.split('?')[0] + '?google_auth=success';
    this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
      window.location.href = url;
    });
  }

  disconnectGoogle(): void {
    this._ui.showLoader();

    this._profile
      .disconnectGoogle()
      .pipe(
        switchMap(() => this._profile.getGoogleStatus()),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: status => {
          if (!status.google.connected) this.googleConnection = null;

          this._ui.showAlertSuccess(this._t.instant('PORTAL.PROFILE_FORM.GOOGLE_DISCONNECTED'));
          this._cd.detectChanges();
        },
        error: () => {
          this._ui.showAlertError?.(this._t.instant('PORTAL.PROFILE_FORM.GOOGLE_DISCONNECT_ERROR'));
        },
      });
  }

  private loadGoogleConnection(): void {
    try {
      const raw = localStorage.getItem(this.GOOGLE_STORAGE_KEY);
      this.googleConnection = raw
        ? (JSON.parse(raw) as FakeGoogleConnection)
        : null;
    } catch {
      this.googleConnection = null;
      localStorage.removeItem(this.GOOGLE_STORAGE_KEY);
    }
  }

  handleEditSave(): void {
    if (this.isEditing) {
      this.send();
    } else {
      this.isEditing = true;
      this.form.enable();
    }
  }

  fillData(user: PopulatedUserModel) {
    this.form.patchValue({
      phone_number: user.phone_number,
      phone_extension: user.phone_extension,
      gender: user.gender,
      address: {
        address: user.address_info?.address ?? '',
        country: user.address_info?.country ?? '',
        latitude: user.address_info?.latitude ?? '',
        longitude: user.address_info?.longitude ?? '',
        zipcode: user.address_info?.zipcode ?? '',
        additional_address: user.address_info?.additional_address ?? '',
      },
      additional_address: user.address_info?.additional_address,
      zipcode: user.address_info?.zipcode ?? '',
      license_number: user.broker?.license_number,
      license_expires_at: user.broker?.license_expires_at,
      profile_image: user?.photo_url,
      allow_email_notifications: user?.allow_email_notifications ?? false,
      allow_show_whatsapp_number: user?.allow_show_whatsapp_number ?? false,
      allow_expiring_policies_notifications:
        !!user?.days_expiring_policies_notifications,
      days_expiring_policies_notifications:
        user?.days_expiring_policies_notifications ?? null,
    });
  }

  handleAddress(address: AddressAutocompleteModel): void {
    this.form.controls['address_extra'].setValue(address);
    this._cd.detectChanges();
  }

  resetAddress(): void {
    this.form.controls['address_extra'].patchValue(null);
    this.form.controls['address_extra'].markAsDirty();
  }

  addImage(img: string, field: string): void {
    this.form.controls[field].patchValue(img);
  }

  openModal(): void {
    this.dialog.open(ModalChangePasswordComponent, {
      panelClass: 'custom-dialog-container',
    });
  }

  send() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    this._ui.showLoader();

    const req: EditProfileRequest = {
      photo_base64: this.form.value.profile_image ?? undefined,
      license_number: this.form.value.license_number ?? '',
      license_expires_at: new Date(
        this.form.value.license_expires_at
      ).toISOString(),
      phone_number: this.form.value.phone_number,
      phone_extension: this.form.value.phone_extension,
      gender: this.form.value.gender,
      address_info: {
        address: this.form.value.address?.address ?? '',
        additional_address: this.form.value.additional_address ?? '',
        country: this.form.value.address?.country ?? '',
        latitude: this.form.value.address?.latitude ?? '',
        longitude: this.form.value.address?.longitude ?? '',
        zipcode: this.form.value.zipcode ?? '',
      },
      allow_email_notifications: this.form.value.allow_email_notifications,
      allow_show_whatsapp_number: this.form.value.allow_show_whatsapp_number,
      days_expiring_policies_notifications:
        this.form.value.days_expiring_policies_notifications ?? null,
    };

    this._profile
      .editProfile(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.isEditing = false;
        this.form.disable();
        this._auth.refreshAuth();
        this._ui.showAlertSuccess(this._t.instant('PORTAL.PROFILE_FORM.PROFILE_UPDATED'));
      });
  }
}
