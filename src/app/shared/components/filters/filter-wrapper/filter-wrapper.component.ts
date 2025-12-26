import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs';
import { FilterTypeEnum } from 'src/app/shared/enums/filter-type.enum';
import { addZero } from 'src/app/shared/helpers/add-zero';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import {
  FilterActive,
  FilterModel,
  FilterResults,
  FilterWrapperModel,
} from 'src/app/shared/models/filters.model';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';

@Component({
  selector: 'app-filter-wrapper',
  templateUrl: './filter-wrapper.component.html',
  styleUrls: ['./filter-wrapper.component.scss'],
})
export class FilterWrapperComponent implements OnInit {
  @Input() config!: FilterWrapperModel;
  /**
   * Filter change esta deprecado, no emitira eventos, pero lo dejare un tiempo mientras migramos al nuevo evento activeFilterChange
   */
  @Output() filterChange: EventEmitter<FilterResults> =
    new EventEmitter<FilterResults>();
  @Output() activeFilterChange: EventEmitter<
    Record<string, FilterActive | FilterActive[]>
  > = new EventEmitter<Record<string, FilterActive | FilterActive[]>>();
  @Output() closeFilters: EventEmitter<void> = new EventEmitter<void>();

  form?: FormGroup;
  filtersActive: Record<string, FilterActive | FilterActive[]> = {};

  filterTypes = FilterTypeEnum;
  activePaymentEntity: 'Insurer' | 'Account' | null = null;
  addZero = addZero;

  ngOnInit(): void {
    this.form = this.createFormFromConfig();

    if (this.hasPaymentEntity()) {
      const insurerControl = this.form?.get('insurer_id');
      const accountControl = this.form?.get('account_id');

      insurerControl?.disable();
      accountControl?.disable();
    }
  }

  createFormFromConfig(): FormGroup {
    const controls: Record<string, AbstractControl> = {};
    this.config.filters.forEach(filter => {
      if (filter.type === FilterTypeEnum.DATE_RANGE) {
        controls[`RANGE_${filter.name}`] = new FormGroup({
          start: new FormControl(null),
          end: new FormControl(null),
        });
        return;
      }

      if (
        (filter.type === FilterTypeEnum.SELECT ||
          filter.type === FilterTypeEnum.MULTISELECT) &&
        filter.options
      ) {
        filter.options = filter.options.pipe(
          map((opts: { code: string; name: string }[]) => {
            if (!Array.isArray(opts)) return opts;
            return [{ code: '', name: 'All' }, ...opts];
          })
        );
      }

      controls[filter.name] = new FormControl(null);
    });
    return new FormGroup(controls);
  }

  getFormRANGE(key: string): FormGroup {
    return this.form?.get('RANGE_' + key) as FormGroup;
  }

  sendFilters(): void {
    Object.entries(this.form?.getRawValue() ?? {}).forEach(result => {
      if (result[0].split('_')[0] === 'RANGE') {
        const arrayControl = result[0].split('_');
        arrayControl.splice(0, 1);
        const name = arrayControl.join('_');
        const value = result[1] as Record<string, string>;
        if (value['start']) {
          this.filtersActive[`start_${name}`] = {
            label: `Start ${this.getConfigByName(
              name
            ).label.toLocaleLowerCase()}`,
            name: `start_${name}`,
            text: this.formatDate(value['start']),
            value: this.formatDate(value['start']),
          };
        }
        if (value['end']) {
          this.filtersActive[`end_${name}`] = {
            label: `End ${this.getConfigByName(
              name
            ).label.toLocaleLowerCase()}`,
            name: `end_${name}`,
            text: this.formatDate(value['end']),
            value: this.formatDate(value['end']),
          };
        }
        return;
      }
    });
    this.activeFilterChange.emit(this.filtersActive);
    this.form?.reset();
    this.filtersActive = {};
  }

  formatDate(date: string): string {
    const dateEval = new Date(date);
    return `${dateEval.getFullYear()}-${this.addZero(
      dateEval.getMonth() + 1
    )}-${this.addZero(dateEval.getDate())}`;
  }

  handleDropdown(name: string, option: DropdownOption): void {
    this.filtersActive[name] = {
      name,
      label: this.getConfigByName(name).label,
      text: option.name,
      value: option.code,
    };
  }

  handleMultiDropdown(name: string, options: DropdownOption[]): void {
    this.filtersActive[name] = {
      name,
      label: this.getConfigByName(name).label,
      text: options.map(o => o.name).join(', '),
      value: options.map(o => o.code),
    };
  }

  handlePaymentEntity(name: string, option: DropdownOption) {
    this.filtersActive[name] = {
      name,
      label: this.getConfigByName(name).label,
      text: option.name,
      value: option.code,
    };

    const selectedCode = option.code;

    const controls = {
      insurer: this.form?.get('insurer_id') as AbstractControl | null,
      account: this.form?.get('account_id') as AbstractControl | null,
    };

    if (selectedCode === 'Insurer') {
      this.activePaymentEntity = 'Insurer';

      controls.insurer?.enable();
      controls.account?.reset(null, { emitEvent: false });
      controls.account?.disable();
      delete this.filtersActive['account_id'];
    } else if (selectedCode === 'Account') {
      this.activePaymentEntity = 'Account';
      controls.insurer?.reset(null, { emitEvent: false });
      controls.insurer?.disable();
      delete this.filtersActive['insurer_id'];
      controls.account?.enable();
    } else {
      this.activePaymentEntity = null;
      controls.insurer?.reset(null, { emitEvent: false });
      controls.insurer?.disable();
      delete this.filtersActive['insurer_id'];
      controls.account?.reset(null, { emitEvent: false });
      controls.account?.disable();
      delete this.filtersActive['account_id'];
    }

    this.form?.updateValueAndValidity();
  }

  handleText(name: string, text: string): void {
    if (text && text.length > 0) {
      this.filtersActive[name] = {
        name,
        label: this.getConfigByName(name).label,
        text,
        value: text,
      };
      return;
    }
    delete this.filtersActive['name'];
  }

  handleNumber(name: string, value: string): void {
    if (value && `${value}`.length > 0) {
      this.filtersActive[name] = {
        name,
        label: this.getConfigByName(name).label,
        text: value,
        value: parseFloat(parseFloat(value).toFixed(2)),
      };
      return;
    }
    delete this.filtersActive['name'];
  }

  handleBrokerOrAccount(
    name: string,
    option?:
      | PopulatedBrokerModel
      | PopulatedBrokerModel[]
      | PopulatedAccount
      | PopulatedAccount[]
  ): void {
    if (!option) {
      delete this.filtersActive[name];
      return;
    }

    const isAccountContext =
      this.hasPaymentEntity() ||
      this.getConfigByName(name).type === this.filterTypes.CLIENT_SELECTOR;

    if (Array.isArray(option)) {
      const arrayOption = option as (PopulatedBrokerModel | PopulatedAccount)[];

      const textValue = arrayOption
        .map(o => {
          if (isAccountContext && (o as PopulatedAccount).account_name) {
            return (o as PopulatedAccount).account_name;
          }

          const firstName = o.user?.first_name ?? '';
          const lastName = o.user?.last_name ?? '';
          return `${firstName} ${lastName}`.trim();
        })
        .join(', ');

      this.filtersActive[name] = {
        name,
        label: this.getConfigByName(name).label,
        text: textValue,
        value: arrayOption.map(o => o._id),
      };
      return;
    }

    const singleOption = option as PopulatedBrokerModel | PopulatedAccount;

    const textValue =
      isAccountContext && (singleOption as PopulatedAccount).account_name
        ? (singleOption as PopulatedAccount).account_name
        : `${singleOption.user?.first_name ?? ''} ${
            singleOption.user?.last_name ?? ''
          }`.trim();

    this.filtersActive[name] = {
      name,
      label: this.getConfigByName(name).label,
      text: textValue,
      value: singleOption._id,
    };
  }

  hasPaymentEntity(): boolean {
    return this.config.filters.some(
      f => f.type === this.filterTypes.PAYMENT_ENTITY
    );
  }

  private getConfigByName(name: string): FilterModel {
    return this.config.filters.find(item => item.name === name) as FilterModel;
  }
}
