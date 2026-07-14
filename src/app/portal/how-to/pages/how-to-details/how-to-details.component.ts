import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { finalize, switchMap, take, tap } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { HowToService } from '@app/shared/services/how-to.service';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { UrlService } from '@app/shared/services/url.service';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { getVideoId } from '@app/shared/helpers/get-video-id';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteHowToModalComponent,
  DeleteHowToModalData,
  DeleteHowToModalResult,
} from 'src/app/portal/how-to/components/delete-how-to-modal/delete-how-to-modal.component';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-how-to-details',
  templateUrl: './how-to-details.component.html',
  styleUrls: ['./how-to-details.component.scss'],
})
export class HowToDetailComponent {
  howTo!: HowToModel;
  video: SafeResourceUrl | null = null;
  description!: SafeHtml;
  isShort: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _howTo: HowToService,
    private _router: Router,
    public _url: UrlService,
    public file: UploadFileService,
    private _sanitizer: DomSanitizer,
    private _t: TranslateService,
    private _dialog: MatDialog
  ) {
    this._loadHowTo();
  }

  private _loadHowTo(): void {
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._howTo.getHowToBySerial(id);
        }),
        tap(howTo => {
          this.howTo = howTo;
          this.description = this._sanitizer.bypassSecurityTrustHtml(
            howTo.description ?? ''
          );
          this.processVideoUrl(howTo.video);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal-admin/how-to'),
      });
  }

  goBack(): void {
    this._router.navigateByUrl('portal-admin/how-to');
  }

  openTenantStatusModal(): void {
    if (!this.howTo.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.HOW_TO.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.HOW_TO.BTN_UPDATE_STATUS',
      tenants: this.howTo.tenants,
      statusToggle: true,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result?.status) this._executeTenantStatusUpdate(result.tenantIds, result.status);
      });
  }

  private _executeTenantStatusUpdate(tenantIds: string[], status: 'ACTIVE' | 'INACTIVE'): void {
    this._ui.showLoader();
    this._howTo
      .updateTenantStatus(this.howTo._id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.SUCCESS_TENANT_STATUS'));
          this._loadHowTo();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.HOW_TO.ERROR_TENANT_STATUS')),
      });
  }

  deleteHowTo(_id: string): void {
    if (!this.howTo.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.HOW_TO.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((resp: boolean) => {
          if (resp) this._executeFullDelete(_id);
        });
      return;
    }

    const data: DeleteHowToModalData = { tenants: this.howTo.tenants };
    this._dialog
      .open(DeleteHowToModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: DeleteHowToModalResult | null) => {
        if (result) this._executePartialDelete(result.tenantIds);
      });
  }

  private _executePartialDelete(tenantIdsToRemove: string[]): void {
    const remaining = (this.howTo.tenant_ids ?? []).filter(id => !tenantIdsToRemove.includes(id));

    if (remaining.length === 0) {
      this._executeFullDelete(this.howTo._id);
      return;
    }

    this._ui.showLoader();
    this._howTo
      .editHowTo({ tenant_ids: remaining }, this.howTo._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.DELETED'));
        this._router.navigateByUrl('portal-admin/how-to');
      });
  }

  private _executeFullDelete(_id: string): void {
    this._ui.showLoader();
    this._howTo
      .deleteHowTo(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.DELETED'));
          this._router.navigateByUrl('portal-admin/how-to');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.HOW_TO.DELETE_ERROR')),
      });
  }

  processVideoUrl(url: string) {
    if (!url) return;

    this.isShort = url.includes('/shorts/');

    const videoId = getVideoId(url);

    if (!videoId) {
      this.video = null;
      return;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`;
    this.video = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
