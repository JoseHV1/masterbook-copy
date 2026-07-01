import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  finalize,
  forkJoin,
  map,
  Observable,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { PopulatedFormModel } from 'src/app/shared/interfaces/models/form.model';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { FormService } from 'src/app/shared/services/form.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { CreateFormModalComponent } from '../create-form-modal/create-form-modal.component';
import { MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/tooltip';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { AuthService } from 'src/app/shared/services/auth.service';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { brokersAdminDataset } from 'src/app/shared/datatsets/roles.datasets';
import { AccountFormModalComponent } from '../account-form-modal/account-form-modal.component';
import { IntegrationsService } from '@app/shared/services/integration.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forms-modal',
  templateUrl: './forms-modal.component.html',
  styleUrls: ['./forms-modal.component.scss'],
  providers: [MAT_TOOLTIP_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class FormsModalComponent implements OnInit {
  forms: PopulatedFormModel[] = [];
  title = '';
  displayedColumns: string[] = ['serial', 'name', 'insurer', 'actions'];
  showActions = false;
  showSendEmailOption: boolean = false;
  connected: boolean = false;
  role = this._auth.getAuth()?.user.role as RolesEnum;
  roles = RolesEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: {
      policy_type: PopulatedPolicyTypeModel;
      show_email?: boolean;
      filter_active?: boolean;
    },
    private _dialog: MatDialogRef<FormsModalComponent>,
    private _dialogCreate: MatDialog,
    private _forms: FormService,
    private _ui: UiService,
    private _auth: AuthService,
    private _integrations: IntegrationsService,
    private _uploadFile: UploadFileService,
    private _t: TranslateService
  ) {
    this.title = this._t.instant('PORTAL.FORMS.MODAL_TITLE', { name: this._data.policy_type.name }).toUpperCase();
    this.showSendEmailOption = this._data.show_email ?? false;

    this._ui.showLoader();
    forkJoin([this._fetchForms()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();

    if (this.role === RolesEnum.ADMIN) {
      this.showActions = [RolesEnum.ADMIN].includes(this.role);
    } else {
      this.showActions = [
        ...brokersAdminDataset,
        RolesEnum.INDEPENDANT_BROKER,
      ].includes(this.role);
    }
  }

  ngOnInit(): void {
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;
      },
      error: err => {
        this._ui.showAlertError(this._t.instant('PORTAL.FORMS.STATUS_LOAD_ERROR'));
      },
    });
  }

  loginGoogle() {
    if (!this.connected) {
      const returnTo = '/portal/request-forms';
      this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
        window.location.href = url;
      });
    }
  }

  _fetchForms(): Observable<PopulatedFormModel[]> {
    let filterText = this._forms.buildFormFilterText(this._data.policy_type._id ?? '');
    if (this._data.filter_active) filterText += '&status=ACTIVE';
    return this._forms
      .getForms(0, 100, filterText)
      .pipe(
        map(resp => resp.records),
        tap(resp => (this.forms = resp))
      );
  }

  openModalAccounts(form: PopulatedFormModel | null = null) {
    this._dialogCreate
      .open(AccountFormModalComponent, {
        autoFocus: false,
        data: { id: form?._id },
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() => this._fetchForms())
      )
      .subscribe(() => {});
  }

  openModalCreateForm(form: PopulatedFormModel | null = null) {
    this._dialogCreate
      .open(CreateFormModalComponent, {
        autoFocus: false,
        data: { policy_type: this._data.policy_type, form },
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() => this._fetchForms())
      )
      .subscribe(() => {});
  }

  getInsurerNames(element: PopulatedFormModel): string {
    return (element?.insurers || []).map(i => i.name).join(', ');
  }

  deleteForm(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: this._t.instant('PORTAL.FORMS.CONFIRM_DELETE'),
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._forms
      .deleteForm(_id)
      .pipe(
        switchMap(() => this._fetchForms()),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe(() => {
        this._ui.showAlertSuccess(this._t.instant('PORTAL.FORMS.FORM_DELETED'));
      });
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }

  openFile(url: string | undefined): void {
    if (!url) return;

    this._uploadFile.getUrlFile(url).subscribe({
      next: res => {
        if (res) {
          window.open(res, '_blank');
        }
      },
      error: err => {
        console.error('Error al obtener el acceso al archivo', err);
      },
    });
  }

  canModify(element: any): boolean {
    const user = this._auth.getAuth()?.user;

    if (!user || !user.role) return false;

    const elementAgencyId = element.agency_id
      ? String(element.agency_id)
      : null;
    const isAdmin = user?.role === this.roles.ADMIN;
    const admiteRoles = [
      this.roles.AGENCY_ADMINISTRATOR,
      this.roles.INDEPENDANT_BROKER,
      this.roles.AGENCY_OWNER,
    ];

    if (isAdmin) {
      return elementAgencyId === null;
    }

    const isOwner = elementAgencyId === user?.agency_id;
    const hasPermissionRoles = admiteRoles.includes(user?.role);
    return isOwner && hasPermissionRoles;
  }
}
