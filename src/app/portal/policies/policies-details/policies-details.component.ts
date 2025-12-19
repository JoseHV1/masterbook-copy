import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import {
  finalize,
  switchMap,
  take,
  filter,
  takeUntil,
  Subject,
  tap,
  map,
  of,
} from 'rxjs';
import { PopulatedPolicyModel } from 'src/app/shared/interfaces/models/policy.model';
import { FileInfoModel } from 'src/app/shared/interfaces/models/file-info.model';
import { PoliciesService } from 'src/app/shared/services/policies.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { Location } from '@angular/common';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@app/shared/services/auth.service';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';

@Component({
  selector: 'app-policies-details',
  templateUrl: './policies-details.component.html',
  styleUrls: ['./policies-details.component.scss'],
})
export class PoliciesDetailsComponent implements OnInit, OnDestroy {
  policy!: PopulatedPolicyModel;
  refreredPolicy!: PopulatedPolicyModel;
  showActions = false;
  isOwner!: boolean;
  private destroy$ = new Subject<void>();

  constructor(
    private activateRoute: ActivatedRoute,
    public url: UrlService,
    private _policy: PoliciesService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private dialog: MatDialog,
    private _auth: AuthService
  ) {
    this.isOwner = ownersRolesDataset.includes(
      this._auth.getAuth()?.user.role ?? RolesEnum.INSURED
    );
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._policy.getPolicyBySerial(id);
        }),
        switchMap(policy => {
          this.policy = policy;
          if (policy.refered_policy_id) {
            return this._policy
              .getPolicy(policy.refered_policy_id)
              .pipe(
                tap(
                  refreredPolicyPolicy =>
                    (this.refreredPolicy = refreredPolicyPolicy)
                )
              );
          }
          return of(policy);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal/policies'),
      });
  }

  ngOnInit(): void {
    this.updateActionsVisibility(this._router.url);

    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((e: any) =>
        this.updateActionsVisibility(e.urlAfterRedirects || e.url)
      );
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  private updateActionsVisibility(url: string): void {
    this.showActions =
      url.includes('/portal/') && !url.includes('/portal-client/');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openFile(data: string | FileInfoModel): void {
    window.open(typeof data === 'string' ? data : data.document, '_blank');
  }

  deletePolicy(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this policy?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._policy
      .deletePolicy(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Policy deleted successfully');
        this._router.navigateByUrl('portal/policies');
      });
  }

  goBack(): void {
    this._location.back();
  }
}
