import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { UiService } from 'src/app/shared/services/ui.service';
import { EstructuredBusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { finalize, forkJoin, Observable, Subject, takeUntil, tap } from 'rxjs';
import { PopulatedPolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { ProductTypeEnum } from 'src/app/shared/enums/product-type.enum';
import { FormGroup, FormControl } from '@angular/forms';
import { mapEstructuredBusinessLines } from '@app/shared/helpers/estructured-business-lines.mapper';

@Component({
  selector: 'app-endorsements-selector',
  templateUrl: './endorsements-selector.component.html',
  styleUrls: ['./endorsements-selector.component.scss'],
})
export class EndorsementsSelectorComponent implements OnDestroy {
  @Input() showNext = true;
  @Output() selectedChange: EventEmitter<PopulatedPolicyTypeModel[]> =
    new EventEmitter(); //Se emite al presionar el botón next
  @Output() selectedItChange: EventEmitter<PopulatedPolicyTypeModel[]> =
    new EventEmitter(); //Se emite cada vez que se hace un cambio de selección
  business_lines: EstructuredBusinessLineModel[] = [];
  selected?: EstructuredBusinessLineModel;
  destroy$ = new Subject<void>();
  selectedEndorsements: PopulatedPolicyTypeModel[] = [];
  policyTypes: PopulatedPolicyTypeModel[] = [];
  form: FormGroup = new FormGroup({ query: new FormControl('') });

  constructor(private _dataset: DatasetsService, private _ui: UiService) {
    this._ui.showLoader();
    forkJoin([this._loadBusinessLines()])
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => this._filterPolicyTypes());
    this.form
      .get('query')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => this._filterPolicyTypes());
  }

  private _loadBusinessLines(): Observable<PopulatedPolicyTypeModel[]> {
    return this._dataset
      .getAllPolicyTypes(ProductTypeEnum.ENDORSEMENT)
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

  isSelected(item: PopulatedPolicyTypeModel): boolean {
    return this.selectedEndorsements.some(i => i._id === item._id);
  }

  toggleSelected(item: EstructuredBusinessLineModel): void {
    this.selected = this.selected?._id === item._id ? undefined : item;
  }

  add(type: PopulatedPolicyTypeModel): void {
    if (this.selectedEndorsements.some(item => item._id === type._id)) return;
    this.selectedEndorsements.push(type);
    this.selectedItChange.emit(this.selectedEndorsements);
  }

  remove(type: PopulatedPolicyTypeModel): void {
    const index = this.selectedEndorsements.findIndex(
      item => item._id === type._id
    );
    if (index < 0) return;
    this.selectedEndorsements.splice(index, 1);
    this.selectedItChange.emit(this.selectedEndorsements);
  }

  next(): void {
    this.selectedChange.emit(this.selectedEndorsements);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
