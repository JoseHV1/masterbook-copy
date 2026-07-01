import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProfileService } from 'src/app/shared/services/profile.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { PopulatedUserModel } from 'src/app/shared/interfaces/models/user.model';
import { ModalChangePasswordComponent } from 'src/app/portal/profile/components/modal-change-password/modal-change-password.component';
import { EditProfileRequest } from 'src/app/shared/interfaces/requests/profile/edit-profile.request';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin-profile-form',
  templateUrl: './admin-profile-form.component.html',
  styleUrls: ['./admin-profile-form.component.scss'],
})
export class AdminProfileFormComponent implements OnInit {
  form = new FormGroup({
    profile_image: new FormControl<string | null>(null),
  });

  dataUser!: PopulatedUserModel;
  imageProfile!: string;

  readonly frontBaseUrl = window.location.origin;
  readonly leadsToken = environment.TOKEN_FOR_LEADS_MASTERBOOK;

  constructor(
    private _auth: AuthService,
    private _profile: ProfileService,
    private _ui: UiService,
    private _uploadFile: UploadFileService,
    private _dialog: MatDialog,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    this.dataUser = this._auth.getAuth()?.user as PopulatedUserModel;

    if (this.dataUser.photo_url) {
      this._uploadFile.getUrlFile(this.dataUser.photo_url).subscribe(url => {
        this.imageProfile = url;
      });
    } else {
      this.imageProfile = '/assets/images/portal/image_default.webp';
    }
  }

  addImage(img: string): void {
    this.form.controls.profile_image.patchValue(img);
  }

  openChangePassword(): void {
    this._dialog.open(ModalChangePasswordComponent, {
      panelClass: 'custom-dialog-container',
    });
  }

  copyUrl(network: string): void {
    const url = `${this.frontBaseUrl}/leads/agency/${this.leadsToken}/${network}`;
    navigator.clipboard.writeText(url).then(() => {
      this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.PROFILE.LINK_COPIED'));
    });
  }

  save(): void {
    const photo = this.form.value.profile_image;
    if (!photo) return;

    this._ui.showLoader();

    this._profile
      .editProfile({ photo_base64: photo } as EditProfileRequest)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._auth.refreshAuth();
        this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.PROFILE.UPDATED'));
      });
  }
}
