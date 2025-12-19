import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize, switchMap, take, tap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ClaimsService } from 'src/app/shared/services/claims.service';
import { UiService } from 'src/app/shared/services/ui.service';
import {
  ClaimAttachmentModel,
  PopulatedClaimModel,
} from 'src/app/shared/interfaces/models/claims.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { AuthService } from '@app/shared/services/auth.service';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';

@Component({
  selector: 'app-claims-details',
  templateUrl: './claims-details.component.html',
  styleUrls: ['./claims-details.component.scss'],
})
export class ClaimsDetailsComponent {
  claim!: PopulatedClaimModel;
  files: ClaimAttachmentModel[] = [];
  isOwner!: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _claims: ClaimsService,
    private router: Router,
    private dialog: MatDialog,
    private _location: Location,
    public _url: UrlService,
    private _auth: AuthService
  ) {
    this.isOwner = ownersRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(resp => {
          const id = resp['id'];
          if (!id) throw new Error();
          return this._loadClaim(id);
        }),
        tap((claim: PopulatedClaimModel) => {
          this.files = (claim.attachments || []).map((file: any) => ({
            ...file,
            file_type: (file.file_type || '').toLowerCase(),
          }));
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => {
          this.router.navigateByUrl('portal/claims');
        },
      });
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  getStatusClass(status: string): string {
    const baseClasses = 'badge rounded-pill fw-medium px-3 py-2';
    const colorMap: Record<string, string> = {
      approved: 'bg-success-subtle text-success',
      rejected: 'bg-danger-subtle text-danger',
      pending: 'bg-warning-subtle text-warning',
      submitted: 'bg-info-subtle text-info',
    };

    return `${baseClasses} ${
      colorMap[(status || '').toLowerCase()] ||
      'bg-secondary-subtle text-secondary'
    }`;
  }

  isImage(fileType: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(
      fileType?.toLowerCase()
    );
  }

  openFile(url: string): void {
    window.open(url, '_blank');
  }

  _loadClaim(serial: string) {
    return this._claims
      .getClaimBySerial(serial)
      .pipe(tap((resp: PopulatedClaimModel) => (this.claim = resp)));
  }

  openConfirmationModal(id: string) {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this claim?`,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) {
          this._claims.deleteClaim(id).subscribe({
            next: () => {
              this.router.navigateByUrl(`portal/claims`);
              this._ui.showAlertSuccess(
                'The claim has been successfully deleted'
              );
            },
          });
        }
      });
  }

  goBack(): void {
    this._location.back();
  }
}
