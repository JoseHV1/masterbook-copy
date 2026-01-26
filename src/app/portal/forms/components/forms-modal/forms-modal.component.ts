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
  connected: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _data: { policy_type: PopulatedPolicyTypeModel },
    private _dialog: MatDialogRef<FormsModalComponent>,
    private _dialogCreate: MatDialog,
    private _forms: FormService,
    private _ui: UiService,
    private _auth: AuthService,
    private _integrations: IntegrationsService,
    private _uploadFile: UploadFileService
  ) {
    this.title = `${this._data.policy_type.name} forms`.toUpperCase();

    this._ui.showLoader();
    forkJoin([this._fetchForms()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe();

    const role = this._auth.getAuth()?.user.role as RolesEnum;
    this.showActions = [
      ...brokersAdminDataset,
      RolesEnum.INDEPENDANT_BROKER,
    ].includes(role);
  }

  ngOnInit(): void {
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;
      },
      error: err => {
        this._ui.showAlertError(`Status failed ${err}`);
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
    return this._forms
      .getForms(
        0,
        100,
        this._forms.buildFormFilterText(this._data.policy_type._id ?? '')
      )
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
        text: `Are you sure you want to delete this form?`,
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
        this._ui.showAlertSuccess('Form deleted successfully');
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
}
