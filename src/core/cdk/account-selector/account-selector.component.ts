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
import { brokerRolesDataset } from 'src/app/shared/datatsets/roles.datasets';
import { RolesEnum } from 'src/app/shared/enums/roles.enum';
import { MyMasterbookValidators } from 'src/app/shared/helpers/mymasterbook-validator';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { UserModel } from 'src/app/shared/interfaces/models/user.model';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-account-selector',
  templateUrl: 'account-selector.component.html',
  styleUrls: ['account-selector.component.scss'],
})
export class AccountSelectorComponent
  implements ControlValueAccessor, OnDestroy
{
  @Input() placeholder: string = 'Select an account';
  @Input() extendedInfo: boolean = false;
  @Input() showAllOption: boolean = false;

  @Input() multiple: boolean = false;

  @ViewChild(MatAutocomplete) autoComplete!: MatAutocomplete;
  @ViewChild('accountInput') accountInput!: ElementRef<HTMLInputElement>;

  @Output() selectionChange: EventEmitter<
    PopulatedAccount | PopulatedAccount[] | undefined
  > = new EventEmitter();

  destroy$: Subject<void> = new Subject();
  open$!: Subject<void>;
  timeout: any = null;

  currentUser: AuthModel;
  form: FormGroup;
  items: AccountSelectorItem[] = [];
  selectedItem?: AccountSelectorItem;
  selectedItems: AccountSelectorItem[] = [];

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
    private _accounts: AccountsService
  ) {
    this.currentUser = this._auth.getAuth() as AuthModel;
    this.fetchAccounts(true);

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
          if (atBottom) this.fetchAccounts(false);
        });
    }, 0);
  }

  closed(): void {
    if (this.multiple) return;

    this.open$.next();
    this.open$.complete();
  }

  displayFn(item?: AccountSelectorItem): string {
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
      this.fetchAccounts(true, query);
      this.selectedItem = undefined;
      this.changeValue();
    }, 500);
  }

  onSelectItem($event: MatAutocompleteSelectedEvent): void {
    if (this.multiple) return;

    this.selectedItem = $event.option.value as AccountSelectorItem;
    this.changeValue();
  }

  onEnterItem(item: AccountSelectorItem): void {
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

  fetchAccounts(newList: boolean, search?: string): void {
    const page = newList ? 0 : this.nextPage;
    const hasMoreRecords = page * this.docsPerCharge < this.totalRecords;

    if (
      brokerRolesDataset.includes(this.currentUser.user.role as RolesEnum) &&
      hasMoreRecords
    ) {
      this.loading = true;
      this._accounts
        .getAccounts(page, this.docsPerCharge, search)
        .pipe(
          tap(resp => {
            this.nextPage = resp.page;
            this.totalRecords = resp.total_records > 1 ? resp.total_records : 1;
          }),
          map(resp => {
            const accountsList: AccountSelectorItem[] = resp.records.map(
              account => ({
                name: this.getAccountText(account),
                code: account._id,
                item: account,
                disabled: false,
              })
            );

            if (this.showAllOption && newList) {
              const allOption: AccountSelectorItem = {
                name: 'All',
                code: 'ALL',
                item: {} as PopulatedAccount,
                disabled: false,
              };
              return [allOption, ...accountsList];
            }

            return accountsList;
          }),
          finalize(() => (this.loading = false))
        )
        .subscribe(accounts => {
          this.items = newList ? accounts : [...this.items, ...accounts];
          if (this.multiple && this.form.get('value')?.value) {
            this.applyAllExclusionLogic(this.form.get('value')?.value || []);
          }
        });
    }

    if (this.currentUser.user.role === RolesEnum.INSURED) {
      let insuredAccount: AccountSelectorItem = {
        name: `${this.currentUser.user.first_name ?? ''} ${
          this.currentUser.user.last_name ?? ''
        }`,
        code: this.currentUser.user.account?._id ?? '',
        item: {
          ...this.currentUser.user.account,
          user: this.currentUser.user as UserModel,
        } as PopulatedAccount,
        disabled: false,
      };

      if (this.showAllOption) {
        const allOption: AccountSelectorItem = {
          name: this._translate.instant('COMMON.ALL'),
          code: 'ALL',
          item: {} as PopulatedAccount,
          disabled: false,
        };
        this.items = [allOption, insuredAccount];
      } else {
        this.items = [insuredAccount];
      }

      if (this.multiple && this.form.get('value')?.value) {
        this.applyAllExclusionLogic(this.form.get('value')?.value || []);
      }
    }
  }

  getAccountText(account: PopulatedAccount): string {
    return this.extendedInfo
      ? `${account.account_name ?? ''}, ${account.user?.first_name ?? ''} ${
          account.user?.last_name ?? ''
        }, ${account.user?.email ?? ''}, ${account.user?.phone_number ?? ''}`
      : `${account.account_name ?? ''}`;
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

      const singleSelection: PopulatedAccount | undefined =
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
      const loadObservables = correctedCodes.map(id =>
        this._accounts.getAccount(id)
      );
      forkJoin(loadObservables)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe(accounts => {
          this.selectedItems = accounts
            .filter(a => a != null)
            .map(account => ({
              code: account._id,
              item: account,
              name: this.getAccountText(account),
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
          item: {} as PopulatedAccount,
          disabled: false,
        };
        this.form
          .get('value')
          ?.setValue(this.selectedItem, { emitEvent: false });
        this.updateErrors();
        return;
      }

      this._accounts.getAccount(value).subscribe(account => {
        this.selectedItem = {
          code: account._id,
          item: account,
          name: this.getAccountText(account),
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

export interface AccountSelectorItem {
  name: string;
  code: string;
  item: PopulatedAccount;
  disabled?: boolean;
}
