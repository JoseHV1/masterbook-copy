import { Location } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalChangeLogsComponent } from '@app/shared/components/modal-change-logs/modal-change-logs.component';
import { ownersRolesDataset } from '@app/shared/datatsets/roles.datasets';
import { RolesEnum } from '@app/shared/enums/roles.enum';
import { mapEstructuredPolicyCategories } from '@app/shared/helpers/estructured-policy-types.mapper';
import { PopulatedPolicyTypeModel } from '@app/shared/interfaces/models/policy-type.model';
import { AuthService } from '@app/shared/services/auth.service';
import {
  finalize,
  forkJoin,
  Observable,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { CommmissionConfigTypeEnum } from 'src/app/shared/enums/commission-config-type.enum';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { CommissionConfigModel } from 'src/app/shared/interfaces/models/commission-config.model';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import {
  EstructuredPolicyCategoryModel,
  FormEstructuredPolicyCategoryModel,
} from 'src/app/shared/interfaces/models/policy-category.model';
import {
  ConfigInsurerRequest,
  CreateCommissionConfigFromInsurerRequest,
} from 'src/app/shared/interfaces/requests/insurer/config-insurer.request';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-insurers-details',
  templateUrl: './insurers-details.component.html',
  styleUrls: ['./insurers-details.component.scss'],
})
export class InsurersDetailsComponent implements OnDestroy {
  insurer!: InsurerModel;
  formEstructuredCategories: FormEstructuredPolicyCategoryModel[] = [];
  commission_configs: CommissionConfigModel[] = [];
  policyTypes: PopulatedPolicyTypeModel[] = [];
  selectedTabIndex: number = 0;
  selected?: FormEstructuredPolicyCategoryModel;
  destroy$ = new Subject<void>();
  form: FormGroup = new FormGroup({ query: new FormControl('') });
  isOwner!: boolean;

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _insurer: InsurerConfigService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _dataset: DatasetsService,
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
          return this._loadInsurer(id);
        }),
        switchMap(insurer => {
          return forkJoin([this._loadCategories(insurer._id)]);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        next: () => this._filterPolicyTypes(),
        error: () => this._router.navigateByUrl('portal/insurer'),
      });
    this.form
      .get('query')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this._filterPolicyTypes());
  }

  openModalChangeLogs(entityId: string): void {
    this.dialog.open(ModalChangeLogsComponent, {
      panelClass: 'custom-dialog-container',
      data: { entityId },
    });
  }

  private _loadCategories(id: string): Observable<PopulatedPolicyTypeModel[]> {
    return this._insurer.getInsurerConfigs(id).pipe(
      switchMap(resp => {
        this.commission_configs = resp;
        return this._dataset.getPolcyTpesDataset().pipe(
          tap(resp => {
            this.policyTypes = resp;
          })
        );
      })
    );
  }

  private _filterPolicyTypes(): void {
    const query = this.form.get('query')?.value.toLowerCase() || '';
    const filterPolicyTypes = this.policyTypes.filter(pt =>
      pt.name.toLowerCase().includes(query)
    );
    this._buildForm(mapEstructuredPolicyCategories(filterPolicyTypes));
    this.selected = this.formEstructuredCategories[0];
  }

  private _buildForm(categories: EstructuredPolicyCategoryModel[]): void {
    this.formEstructuredCategories = categories.map(category => ({
      ...category,
      control_new_business: new FormControl(),
      control_renewal: new FormControl(),
      business_lines: category.business_lines.map(line => ({
        ...line,
        control_new_business: new FormControl(),
        control_renewal: new FormControl(),
        policy_types: line.policy_types.map(type => {
          const commission_new_business = this.commission_configs.find(
            item =>
              item.policy_type_id === type._id &&
              item.type === CommmissionConfigTypeEnum.NEW_BUSINESS
          );
          const commission_renewal = this.commission_configs.find(
            item =>
              item.policy_type_id === type._id &&
              item.type === CommmissionConfigTypeEnum.RENEWAL
          );
          return {
            ...type,
            form: new FormGroup({
              new_business: new FormControl(
                commission_new_business?.commission_percentage ?? 0
              ),
              renewal: new FormControl(
                commission_renewal?.commission_percentage ?? 0
              ),
            }),
          };
        }),
      })),
    }));
  }

  private _loadInsurer(id: string): Observable<InsurerModel> {
    return this._insurer
      .getInsurerBySerial(id)
      .pipe(tap(resp => (this.insurer = resp)));
  }

  send(): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to save this changes?`,
        type: UiModalTypeEnum.INFO,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeSend();
      });
  }

  private _executeSend(): void {
    const commission_configs: CreateCommissionConfigFromInsurerRequest[] = [];

    this.formEstructuredCategories.forEach(category => {
      category.business_lines.forEach(line => {
        line.policy_types.forEach(type => {
          if (type.form.value.new_business)
            commission_configs.push({
              type: CommmissionConfigTypeEnum.NEW_BUSINESS,
              policy_type_id: type._id,
              commission_percentage:
                parseFloat(type.form.value.new_business) ?? 0,
            });

          if (type.form.value.renewal)
            commission_configs.push({
              type: CommmissionConfigTypeEnum.RENEWAL,
              policy_type_id: type._id,
              commission_percentage: parseFloat(type.form.value.renewal) ?? 0,
            });
        });
      });
    });

    const payload: ConfigInsurerRequest = { commission_configs };

    this._ui.showLoader();
    this._insurer
      .configInsurer(this.insurer._id, payload)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Changes saved successfully');
        this._router.navigate(['/portal/insurer']);
      });
  }

  toggleSelected(item: FormEstructuredPolicyCategoryModel): void {
    this.selected = this.selected?._id === item._id ? undefined : item;
  }

  goBack(): void {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
