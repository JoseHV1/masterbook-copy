import { Component, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { EstructuredBusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
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
import { MatDialog } from '@angular/material/dialog';
import { FormsModalComponent } from '../components/forms-modal/forms-modal.component';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { FormControl, FormGroup } from '@angular/forms';
import { mapEstructuredBusinessLines } from '@app/shared/helpers/estructured-business-lines.mapper';

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

  constructor(
    private _dataset: DatasetsService,
    private _ui: UiService,
    private _dialog: MatDialog
  ) {
    this._ui.showLoader();
    forkJoin([this._loadBusinessLines()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => this._filterPolicyTypes());
    this.form
      .get('query')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this._filterPolicyTypes();
      });
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
        data: { policy_type },
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
