import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { PolicyListModel } from 'src/app/shared/models/DTO/policy-list/policy-list.model';
import { PoliciesService } from 'src/app/shared/services/policies.service';

@Component({
  selector: 'app-policy-selector',
  templateUrl: './policy-selector.component.html',
  styleUrls: ['./policy-selector.component.scss'],
})
export class PolicySelectorComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Select a policy...';
  @Input() set appliedFilters(data: Record<string, string>) {
    this.filters = data;
    this.search(25);
  }
  @Input() paramsBySearchs!: { param: string; id: string };
  @Output() changeSelected: EventEmitter<PolicyListModel> =
    new EventEmitter<PolicyListModel>();

  form: FormGroup;
  disabled = false;
  errors: string[] = [];
  errorMessage = '';
  timeout: any = null;
  items!: any[];
  filters: Record<string, string> = {};

  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(
    public currentControl: NgControl,
    private _translate: TranslateService,
    private _policy: PoliciesService
  ) {
    this.currentControl.valueAccessor = this;
    this.form = new FormGroup({
      query: new FormControl(null, []),
      value: new FormControl(null, []),
    });
    this.search(25);
  }

  search(milis?: number) {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this._retrieveItems();
    }, milis ?? 500);
  }

  private _retrieveItems(): void {
    const query = this.form.get('query')?.value ?? '';
    let seachString = query ? `&search=${query}` : '';

    Object.entries(this.filters).forEach(element => {
      seachString = `${seachString}&${element[0]}=${element[1]}`;
    });

    if (!this.paramsBySearchs) {
      this._policy.findPolicies().subscribe(response => {
        this.items = (response as any).map((policy: any) => ({
          ...policy,
          display: `${policy.policy_number} - ${policy.client_id.account_name} (${policy.policy_type_id.business_line_id.name} - ${policy.policy_type_id.name})`,
        }));
      });
    } else {
      this._policy
        .findPoliciesByParams(this.paramsBySearchs)
        .subscribe(response => {
          this.items = (response as any).map((policy: any) => ({
            ...policy,
            display: `${policy.policy_number} - ${policy.client_id.account_name} (${policy.policy_type_id.business_line_id.name} - ${policy.policy_type_id.name})`,
          }));
        });
    }
  }

  selectOption(option: PolicyListModel) {
    this.form.get('value')?.setValue(option);
    this.changeSelected.emit(this.form.value.value);
    this.onChange(this.form.value.value);
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

  formatPolicy(policy: any) {
    return `${policy.policy_number} - ${policy.client_id.account_name} (${policy.policy_type_id.business_line_id.name} - ${policy.policy_type_id.name}) `;
  }

  writeValue(value: PolicyListModel): void {
    this.form.get('value')?.setValue(value);
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
