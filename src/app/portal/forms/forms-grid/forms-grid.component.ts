import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { EstructuredBusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import {
  filter,
  finalize,
  forkJoin,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormsModalComponent } from '../components/forms-modal/forms-modal.component';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { FormControl, FormGroup } from '@angular/forms';
import { mapEstructuredBusinessLines } from '@app/shared/helpers/estructured-business-lines.mapper';
import { AgencySettingsService } from '@app/shared/services/agency-settings.service';
import { EditAgenciesDefaultforms } from '@app/shared/interfaces/requests/agencies/edit-agencies-default-forms.request';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-forms-grid',
  templateUrl: './forms-grid.component.html',
  styleUrls: ['./forms-grid.component.scss'],
})
export class FormGridComponent implements OnDestroy {
  business_lines: EstructuredBusinessLineModel[] = [];
  selected?: EstructuredBusinessLineModel;

  destroy$ = new Subject<void>();

  form: FormGroup = new FormGroup({ query: new FormControl('') });
  policyTypes: PopulatedPolicyTypeModel[] = [];
  showDefaultForms?: boolean;

  constructor(
    private _dataset: DatasetsService,
    private _ui: UiService,
    private _dialog: MatDialog,
    private _agency: AgencySettingsService,
    private _auth: AuthService
  ) {
    this._loadData();
    this.form
      .get('query')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._filterPolicyTypes();
      });

    this._initDefaultforms();
  }

  private _loadData(): void {
    this._ui.showLoader();
    forkJoin([this._loadBusinessLines()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => this._filterPolicyTypes());
  }

  private _initDefaultforms(): void {
    this._auth.auth$
      .pipe(
        takeUntil(this.destroy$),
        filter(user => !!user),
        tap(
          user =>
            (this.showDefaultForms = !!user?.user?.agency?.show_default_forms)
        )
      )
      .subscribe();
  }

  canShowForms() {
    const user = this._auth.getAuth()?.user;

    if (!user || !user.role) return false;

    const admiteShowformsRole = [
      RolesEnum.AGENCY_ADMINISTRATOR,
      RolesEnum.INDEPENDANT_BROKER,
      RolesEnum.AGENCY_OWNER,
    ];

    const canSetShowforms = admiteShowformsRole.includes(user?.role)
      ? true
      : false;

    return canSetShowforms;
  }

  private _loadBusinessLines(): Observable<PopulatedPolicyTypeModel[]> {
    return this._dataset
      .getAllPolicyTypes()
      .pipe(tap(resp => (this.policyTypes = resp)));
  }

  private _filterPolicyTypes(): void {
    const query = this.form.get('query')?.value.toLowerCase() || '';
    const filterPolicyTypes = this.policyTypes.filter(pt =>
      pt.name.toLowerCase().includes(query)
    );
    this.business_lines = mapEstructuredBusinessLines(filterPolicyTypes);
    this.selected = this.business_lines[0];
  }

  toggleSelected(item: EstructuredBusinessLineModel): void {
    this.selected = this.selected?._id === item._id ? undefined : item;
  }

  openModalForms(policy_type: PopulatedPolicyTypeModel) {
    this._dialog
      .open(FormsModalComponent, {
        data: { policy_type, show_email: true },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(
        take(1),
        switchMap(() =>
          this._loadBusinessLines().pipe(tap(() => this._filterPolicyTypes()))
        )
      )
      .subscribe();
  }

  setShowDefaultForms(): void {
    this.showDefaultForms = !this.showDefaultForms;
    this._ui.showLoader();
    const req: EditAgenciesDefaultforms = {
      show_default_forms: this.showDefaultForms,
    };
    this._agency
      .editAgencyShowDefaultforms(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(
            'Show default forms status has been changed'
          );
          this._loadData();
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
