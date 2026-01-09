import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormControl, FormGroup, NgControl } from '@angular/forms';
import { ControlValueAccessor } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { TranslateService } from '@ngx-translate/core';
import {
  finalize,
  fromEvent,
  map,
  Subject,
  takeUntil,
  tap,
  forkJoin,
} from 'rxjs';
import {
  brokersAdminDataset,
  brokersNotAdminDataset,
} from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { PopulatedBrokerModel } from 'src/app/shared/interfaces/models/broker.model';
import { UserModel } from 'src/app/shared/interfaces/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-agent-selector',
  templateUrl: 'agent-selector.component.html',
  styleUrls: ['agent-selector.component.scss'],
})
export class AgentSelectorComponent implements ControlValueAccessor, OnDestroy {
  @Input() placeholder: string = 'Select an agent';
  @Input() showAllOption: boolean = false;

  @Input() multiple: boolean = false;
  @Input() dataTestId?: string;

  @ViewChild(MatAutocomplete) autoComplete!: MatAutocomplete;
  @ViewChild('agentInput') agentInput!: ElementRef<HTMLInputElement>;

  @Output() selectionChange: EventEmitter<
    PopulatedBrokerModel | PopulatedBrokerModel[] | undefined
  > = new EventEmitter();

  destroy$: Subject<void> = new Subject();
  open$!: Subject<void>;
  timeout: any = null;

  currentUser: AuthModel;
  form: FormGroup;
  items: AgentSelectorItem[] = [];
  selectedItem?: AgentSelectorItem;
  selectedItems: AgentSelectorItem[] = [];

  disabled = false;
  loading = false;
  errors: string[] = [];
  errorMessage = '';

  docsPerCharge = 10;
  totalRecords = 1;
  nextPage = 0;

  onChange = (_: string | string[] | null) => {};
  onTouched: () => void = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _auth: AuthService,
    private _users: UserService
  ) {
    this.currentUser = this._auth.getAuth() as AuthModel;
    this.fetchUsers(true);

    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      value: new FormControl(null, []),
    });
  }

  opened(): void {
    if (this.multiple) return;

    this.open$ = new Subject();
    setTimeout(() => {
      fromEvent(this.autoComplete.panel.nativeElement, 'scroll')
        .pipe(takeUntil(this.open$))
        .subscribe(() => {
          const element = this.autoComplete.panel.nativeElement;
          const atBottom =
            element.scrollTop + element.clientHeight >= element.scrollHeight;
          if (atBottom) this.fetchUsers(false);
        });
    }, 0);
  }

  closed(): void {
    if (this.multiple) return;

    this.open$.next();
    this.open$.complete();
  }

  displayFn(item?: AgentSelectorItem): string {
    return this.multiple ? '' : item?.name ?? '';
  }

  onSearch($event: KeyboardEvent): void {
    if (this.multiple) return;

    const validKeys = ['Backspace', 'Delete'];
    if (
      !MyMasterbookValidators.alphanumericPattern.test($event.key) &&
      !validKeys.includes($event.key)
    ) {
      return;
    }

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      let query = ($event.target as any)?.value ?? '';
      query = `&search=${query}`;
      this.fetchUsers(true, query);
      this.selectedItem = undefined;
      this.changeValue();
    }, 500);
  }

  onSelectItem($event: MatAutocompleteSelectedEvent): void {
    if (this.multiple) return;

    this.selectedItem = $event.option.value as AgentSelectorItem;
    this.changeValue();
  }

  onEnterItem(item: AgentSelectorItem): void {
    if (this.multiple) return;

    this.selectedItem = item;
    this.changeValue();
  }

  onMatSelectChange(value: string[]): void {
    if (!this.multiple) return;

    const correctedValue = this.applyAllExclusionLogic(value);

    if (correctedValue.join(',') !== value.join(',')) {
      this.form.get('value')?.setValue(correctedValue, { emitEvent: false });
    }

    this.selectedItems = this.items.filter(item =>
      correctedValue.includes(item.code)
    );

    this.changeValue();
  }

  private applyAllExclusionLogic(selectedCodes: string[]): string[] {
    if (!this.showAllOption || !this.multiple) return selectedCodes;

    const allCode = 'ALL';
    const isAllSelected = selectedCodes.includes(allCode);
    const hasOtherSelections = selectedCodes.length > (isAllSelected ? 1 : 0);

    let correctedCodes = [...selectedCodes];

    if (isAllSelected && hasOtherSelections) {
      correctedCodes = [allCode];

      this.items = this.items.map(opt => ({
        ...opt,
        disabled: opt.code !== allCode,
      }));
    } else if (isAllSelected && selectedCodes.length === 1) {
      this.items = this.items.map(opt => ({
        ...opt,
        disabled: opt.code !== allCode,
      }));
    } else {
      const disableAll = selectedCodes.length > 0;

      this.items = this.items.map(opt => ({
        ...opt,
        disabled: opt.code === allCode && disableAll,
      }));
    }

    return correctedCodes;
  }

  fetchUsers(newList: boolean, search?: string): void {
    const page = newList ? 0 : this.nextPage;
    const hasMoreRecords = page * this.docsPerCharge < this.totalRecords;

    if (
      brokersAdminDataset.includes(this.currentUser.user.role as RolesEnum) &&
      hasMoreRecords
    ) {
      this.loading = true;
      this._users
        .getUsers(page, this.docsPerCharge, search)
        .pipe(
          tap(resp => {
            this.nextPage = resp.page;
            this.totalRecords = resp.total_records > 1 ? resp.total_records : 1;
          }),
          map(resp => {
            const activeUsers = resp.records.filter(
              user => user.status?.toUpperCase() === 'ACTIVE'
            );

            const brokerList: AgentSelectorItem[] = activeUsers.map(broker => ({
              name: this.getUserText(broker),
              code: broker._id,
              item: broker,
              disabled: false,
            }));

            if (this.showAllOption && newList) {
              const allOption: AgentSelectorItem = {
                name: 'All',
                code: 'ALL',
                item: {} as PopulatedBrokerModel,
                disabled: false,
              };
              return [allOption, ...brokerList];
            }

            return brokerList;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe(brokers => {
          this.items = newList ? brokers : [...this.items, ...brokers];
          if (this.multiple && this.form.get('value')?.value) {
            this.applyAllExclusionLogic(this.form.get('value')?.value || []);
          }
        });
    }

    if (
      brokersNotAdminDataset.includes(this.currentUser.user.role as RolesEnum)
    ) {
      let currentUserAgent: AgentSelectorItem = {
        name: `${this.currentUser.user.first_name ?? ''} ${
          this.currentUser.user.last_name ?? ''
        }`,
        code: this.currentUser.user.broker?._id ?? '',
        item: {
          ...this.currentUser.user.broker,
          user: this.currentUser.user as UserModel,
        } as PopulatedBrokerModel,
        disabled: false,
      };

      if (this.showAllOption) {
        const allOption: AgentSelectorItem = {
          name: 'All',
          code: 'ALL',
          item: {} as PopulatedBrokerModel,
          disabled: false,
        };
        this.items = [allOption, currentUserAgent];
      } else {
        this.items = [currentUserAgent];
      }

      if (this.multiple && this.form.get('value')?.value) {
        this.applyAllExclusionLogic(this.form.get('value')?.value || []);
      }
    }
  }

  getUserText(user: PopulatedBrokerModel): string {
    return `${user.user?.first_name ?? ''} ${user.user?.last_name ?? ''}`;
  }

  changeValue(): void {
    if (this.multiple) {
      const codes = this.selectedItems
        .map(item => item.code)
        .filter(code => code);
      this.onChange(codes.length > 0 ? codes : null);

      const models = this.selectedItems
        .filter(item => item.code !== '')
        .map(item => item.item);

      this.selectionChange.emit(models);
    } else {
      this.onChange(this.selectedItem?.code ?? null);
      const singleSelection: PopulatedBrokerModel | undefined =
        this.selectedItem?.item ?? undefined;
      this.selectionChange.emit(singleSelection);
      this.form.get('value')?.setValue(this.selectedItem, { emitEvent: false });
    }
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

  writeValue(value: string | string[] | null): void {
    this.items = this.items.map(opt => ({ ...opt, disabled: false }));

    if (!value || (Array.isArray(value) && value.length === 0)) {
      this.selectedItem = undefined;
      this.selectedItems = [];
      this.form.get('value')?.setValue(null, { emitEvent: false });
      this.updateErrors();
      return;
    }

    if (this.multiple) {
      const codes: string[] = Array.isArray(value) ? value : [value as string];

      const correctedCodes = this.applyAllExclusionLogic(codes);

      if (this.showAllOption && correctedCodes.includes('ALL')) {
        this.selectedItems = this.items.filter(item => item.code === 'ALL');
        this.form.get('value')?.setValue(correctedCodes, { emitEvent: false });
        return;
      }

      this.loading = true;
      const loadObservables = correctedCodes.map(id => this._users.getUser(id));
      forkJoin(loadObservables)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(users => {
          this.selectedItems = users
            .filter(u => u != null)
            .map(user => ({
              code: user._id,
              item: user,
              name: this.getUserText(user),
              disabled: false,
            }));
          this.form
            .get('value')
            ?.setValue(correctedCodes, { emitEvent: false });
          this.updateErrors();
        });
    } else if (typeof value === 'string') {
      if (this.showAllOption && value === 'ALL') {
        this.selectedItem = {
          name: this._translate.instant('COMMON.ALL'),
          code: 'ALL',
          item: {} as PopulatedBrokerModel,
          disabled: false,
        };
        this.form
          .get('value')
          ?.setValue(this.selectedItem, { emitEvent: false });
        this.updateErrors();
        return;
      }

      this._users.getUser(value).subscribe(user => {
        this.selectedItem = {
          code: user._id,
          item: user,
          name: this.getUserText(user),
          disabled: false,
        };
        this.form
          .get('value')
          ?.setValue(this.selectedItem, { emitEvent: false });
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

export interface AgentSelectorItem {
  name: string;
  code: string;
  item: PopulatedBrokerModel;
  disabled?: boolean;
}
