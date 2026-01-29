import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { PaymetGatewayService } from 'src/app/shared/services/payment-gateway.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';

@Component({
  selector: 'app-internal-navbar-options',
  templateUrl: './internal-navbar-options.component.html',
  styleUrls: ['./internal-navbar-options.component.scss'],
})
export class InternalNavbarOptionsComponent {
  imageProfile!: string;
  userRole?: RolesEnum;
  ownerRole: RolesEnum = RolesEnum.AGENCY_OWNER;
  paymentGatewayManageUrl: null | string = null;

  constructor(
    private _auth: AuthService,
    private _router: Router,
    private _paymentGateway: PaymetGatewayService,
    private _ui: UiService,
    private _uploadFile: UploadFileService
  ) {
    const auth = this._auth.getAuth();
    this.userRole = auth?.user.role;

    if (auth && auth.user.photo_url) {
      this._uploadFile.getUrlFile(auth.user.photo_url).subscribe(url => {
        this.imageProfile = url;
      });
    } else {
      this.imageProfile = '/assets/images/portal/image_default.webp';
    }
  }

  navigateToPaymentGateway() {
    this._ui.showLoader();
    this._paymentGateway
      .getCustomerPortalUrl()
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(url => {
        if (url) {
          window.open(url, '_blank');
        }
        this.paymentGatewayManageUrl = url;
      });
  }

  logout(): void {
    this._auth
      .logout()
      .subscribe(resp => (resp ? this._router.navigateByUrl('/') : null));
  }

  navigateTo(url: string) {
    if (
      this.userRole === RolesEnum.INSURED ||
      this.userRole === RolesEnum.PREREGISTER_INSURED
    ) {
      this._router.navigateByUrl(`portal-client/${url}`);
    } else if (this.userRole === RolesEnum.ADMIN) {
      this._router.navigateByUrl(`portal-admin/${url}`);
    } else {
      this._router.navigateByUrl(`portal/${url}`);
    }
  }
}
