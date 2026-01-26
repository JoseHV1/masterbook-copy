import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { PopulatedAccount } from '@app/shared/interfaces/models/accounts.model';
import { PaginatedResponse } from '@app/shared/interfaces/models/paginated-response.model';
import { FilterWrapperModel } from '@app/shared/models/filters.model';
import { AccountsService } from '@app/shared/services/accounts.service';
import { provideNgxMask } from 'ngx-mask';
import { finalize } from 'rxjs';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { UiService } from 'src/app/shared/services/ui.service';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { FormService } from '@app/shared/services/form.service';

export interface SelectedAccount {
  email: string;
  name: string;
}

@Component({
  selector: 'app-account-form-modal',
  templateUrl: './account-form-modal.component.html',
  styleUrls: ['./account-form-modal.component.scss'],
  providers: [provideNgxMask(), MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
})
export class AccountFormModalComponent
  extends FilteredTable<PopulatedAccount>
  implements OnInit
{
  form!: FormGroup;
  filterConfig!: FilterWrapperModel;
  selection = new SelectionModel<SelectedAccount>(true, []);

  data: PaginatedResponse<PopulatedAccount[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  displayedColumns: string[] = ['select', 'id', 'account_name', 'email'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: { id: string },
    private _dialog: MatDialogRef<AccountFormModalComponent>,
    private _ui: UiService,
    private _forms: FormService,
    private _accounts: AccountsService
  ) {
    super();
    this.filterConfig = this._accounts.getAccountsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(this._data.id, [Validators.required]),
      selected_accounts: new FormControl(
        [],
        [Validators.required, Validators.minLength(1)]
      ),
    });
  }

  isItemSelected(email: string | undefined): boolean {
    if (!email) return false;
    return this.selection.selected.some(item => item.email === email);
  }

  onCheckboxChange(row: PopulatedAccount): void {
    const email = row.user?.email;
    const name = `${row.user?.first_name} ${row.user?.last_name}`;

    if (!email) return;

    const existingItem = this.selection.selected.find(
      item => item.email === email
    );

    if (existingItem) {
      this.selection.deselect(existingItem);
    } else {
      this.selection.select({ email, name });
    }

    this.updateFormValue();
  }

  updateFormValue(): void {
    this.form.get('selected_accounts')?.setValue(this.selection.selected);
  }

  _fetchData(page: number, hitsPerPAge?: number): void {
    const hits = hitsPerPAge ?? this.data.limit;
    this._ui.showLoader();
    this._accounts
      .getAccounts(page, hits, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  close(resp: boolean) {
    this._dialog.close(resp);
  }

  submitForm(): void {
    if (this.form.invalid) return;

    this._ui.showLoader();
    this._forms
      .sendFormViaEmail(this.form.value)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: resp => {
          this._openSuccessModal(resp);
        },
        error: () => {},
      });
  }

  private _openSuccessModal(resp: { message: string; count: number }) {
    this._ui
      .showInformationModal({
        text: `${resp.message}. Total emails sent: ${resp.count}`,
        title: 'SUCCESS!',
        type: UiModalTypeEnum.SUCCESS,
      })
      .subscribe(() => {
        this.close(true);
      });
  }
}
