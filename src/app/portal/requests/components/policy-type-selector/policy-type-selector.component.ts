import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { EstructuredBusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { finalize, forkJoin, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { mapEstructuredBusinessLines } from '@app/shared/helpers/estructured-business-lines.mapper';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-policy-type-selector',
  templateUrl: './policy-type-selector.component.html',
  styleUrls: ['./policy-type-selector.component.scss'],
})
export class PolicyTypeSelectorComponent implements OnDestroy {
  @Output() selectedChange: EventEmitter<PopulatedPolicyTypeModel> =
    new EventEmitter();
  @Output() skipEndorsementsEvent: EventEmitter<PopulatedPolicyTypeModel> =
    new EventEmitter();
  business_lines: EstructuredBusinessLineModel[] = [];
  selected?: EstructuredBusinessLineModel;
  form: FormGroup = new FormGroup({ query: new FormControl('') });
  policyTypes: PopulatedPolicyTypeModel[] = [];
  destroy$ = new Subject<void>();
  selectedType?: PopulatedPolicyTypeModel;

  constructor(private _dataset: DatasetsService, private _ui: UiService) {
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
      .getAllPolicyTypes(ProductTypeEnum.POLICY)
      .pipe(tap(resp => (this.policyTypes = resp)));
  }

  private _filterPolicyTypes(): void {
    const query = this.form.get('query')?.value.toLowerCase() || '';
    const filterPolicyTypes = this.policyTypes.filter(bl =>
      bl.name.toLowerCase().includes(query)
    );
    this.business_lines = mapEstructuredBusinessLines(filterPolicyTypes);
    this.selected = this.business_lines[0];
  }

  toggleSelected(item: EstructuredBusinessLineModel): void {
    this.selected = this.selected?._id === item._id ? undefined : item;
  }

  selectPolicyType(): void {
    this.selectedChange.emit(this.selectedType);
  }

  skipEndorsements(): void {
    this.skipEndorsementsEvent.emit(this.selectedType);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
