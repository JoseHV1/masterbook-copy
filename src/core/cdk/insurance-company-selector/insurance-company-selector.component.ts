import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import { finalize, fromEvent, map, Subject, takeUntil, tap } from 'rxjs';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { InsurerConfigService } from 'src/app/shared/services/insurer-config.service';

@Component({
  selector: 'app-insurance-company-selector',
  templateUrl: './insurance-company-selector.component.html',
  styleUrls: ['./insurance-company-selector.component.scss'],
})
export class InsuranceCompanySelectorComponent
  implements ControlValueAccessor, OnDestroy
{
  @Input() placeholder: string = 'Select an insurer';
  @ViewChild(MatAutocomplete) autoComplete!: MatAutocomplete;
  @Output() changeSelected: EventEmitter<InsurerModel | undefined> =
    new EventEmitter();

  destroy$: Subject<void> = new Subject();
  open$!: Subject<void>;
  timeout: any = null;

  form: FormGroup;
  items: InsurerSelectorItem[] = [];
  selectedItem?: InsurerSelectorItem;

  disabled = false;
  loading = false;
  errors: string[] = [];
  errorMessage = '';

  docsPerCharge = 10;
  totalRecords = 1;
  nextPage = 0;

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _insurer: InsurerConfigService
  ) {
    this.fetchInsurers(true);

    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  opened(): void {
    this.open$ = new Subject();
    setTimeout(() => {
      fromEvent(this.autoComplete.panel.nativeElement, 'scroll')
        .pipe(takeUntil(this.open$))
        .subscribe(() => {
          const element = this.autoComplete.panel.nativeElement;
          const atBottom =
            element.scrollTop + element.clientHeight >= element.scrollHeight;
          if (atBottom) this.fetchInsurers(false);
        });
    }, 0);
  }

  closed(): void {
    this.open$.next();
    this.open$.complete();
  }

  displayFn(item?: InsurerSelectorItem): string {
    return item?.name ?? '';
  }

  onSearch($event: KeyboardEvent): void {
    const validKeys = ['Backspace', 'Delete'];
    if (
      !MyMasterbookValidators.alphanumericPattern.test($event.key) &&
      !validKeys.includes($event.key)
    ) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let query = $event.target ? ($event.target as any).value ?? '' : '';
      query = `&search=${query}`;
      this.fetchInsurers(true, query);
      this.selectedItem = undefined;
      this.changeValue();
    }, 500);
  }

  onSelectItem($event: MatAutocompleteSelectedEvent): void {
    this.selectedItem = $event.option.value as InsurerSelectorItem;
    this.changeValue();
  }

  onEnterItem(item: InsurerSelectorItem): void {
    this.selectedItem = item;
    this.changeValue();
  }

  fetchInsurers(newList: boolean, search?: string): void {
    const page = newList ? 0 : this.nextPage;
    const hasMoreRecords = page * this.docsPerCharge < this.totalRecords;
    if (hasMoreRecords) {
      this.loading = true;
      this._insurer
        .getInsurers(page, this.docsPerCharge, search)
        .pipe(
          tap(resp => {
            this.nextPage = resp.page;
            this.totalRecords = resp.total_records > 1 ? resp.total_records : 1;
          }),
          map(resp => {
            return resp.records.map(insurer => ({
              name: insurer.name,
              code: insurer._id,
              item: insurer,
            }));
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe(
          insurers =>
            (this.items = newList ? insurers : [...this.items, ...insurers])
        );
    }
  }

  changeValue(): void {
    this.onChange(this.selectedItem?.code ?? null);
    this.changeSelected.emit(this.selectedItem?.item ?? undefined);
    this.updateErrors();
  }

  updateErrors(): void {
    this.errors = Object.keys(this.currentControl.errors ?? {}).map(err =>
      err.toUpperCase()
    );
    this.form.get('value')?.setErrors(this.currentControl.errors);
    this.errorMessage = this.errors.length
      ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
      : '';
  }

  writeValue(value: string): void {
    if (value && value !== '') {
      this._insurer.getInsurer(value).subscribe(insurer => {
        this.selectedItem = {
          code: insurer._id,
          item: insurer,
          name: insurer.name,
        };

        this.form.get('value')?.setValue(this.selectedItem);
        this.updateErrors();
      });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled
      ? this.form.get('value')?.disable()
      : this.form.get('value')?.enable();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

export interface InsurerSelectorItem {
  name: string;
  code: string;
  item: InsurerModel;
}
