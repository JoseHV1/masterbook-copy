import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DropdownOption } from '../dropDown/dropdown.component';
import { DatasetsService } from 'src/app/shared/services/dataset.service';
import { Observable, of, startWith, map } from 'rxjs';

@Component({
  selector: 'app-insurer-selector',
  templateUrl: './insurer-selector.component.html',
  styleUrls: ['./insurer-selector.component.scss'],
})
export class InsurerSelectorComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder: string = 'Select an insurer...';
  @Output() changeSelected: EventEmitter<DropdownOption> =
    new EventEmitter<DropdownOption>();

  form: FormGroup;
  items: DropdownOption[] = [];
  filteredItems!: Observable<DropdownOption[]>;

  onChange = (_: any) => {};
  onTouched = () => {};
  errors: string[] = [];
  errorMessage = '';

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _dataset: DatasetsService
  ) {
    this.currentControl.valueAccessor = this;

    this.form = new FormGroup({
      query: new FormControl(''),
      value: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this._dataset.getInsuranceCompaniesDataset().subscribe(companies => {
      this.items = companies.map(item => ({
        code: item._id,
        name: item.name,
      }));

      this.filteredItems = this.form.get('query')!.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || ''))
      );
    });
  }

  get queryControl(): FormControl {
    return this.form.get('query') as FormControl;
  }

  private _filter(value: string | DropdownOption): DropdownOption[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value.name.toLowerCase();
    return this.items.filter(option =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  selectOption(option: DropdownOption) {
    this.form.get('value')?.setValue(option);
    this.form.get('query')?.setValue(option.name, { emitEvent: false });
    this.changeSelected.emit(option);
    this.onChange(option);
    this.updateErrors();
  }

  updateErrors(): void {
    this.errors = Object.keys(this.currentControl.errors ?? {}).map(err =>
      err.toUpperCase()
    );
    this.form.get('value')?.setErrors(this.currentControl.errors);
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    this.errorMessage = this.errors.length
      ? this._translate.instant(`FORM_ERROR.${this.errors[0]}`)
      : '';
  }

  writeValue(value: DropdownOption): void {
    this.form.get('value')?.setValue(value);
    this.form.get('query')?.setValue(value?.name ?? '', { emitEvent: false });
    this.updateErrors();
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
}
