import { Component, AfterViewInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountsService } from '../../../shared/services/accounts.service';
import { UiService } from '../../../shared/services/ui.service';
import { finalize } from 'rxjs';
import { FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilteredTable } from 'src/app/shared/classes/filtered-table-base/filtered-table.base';
import { accountTutor } from '@app/shared/tutors/account-tutor';
import { TutorService } from '@app/shared/services/tutor.service';
import { TutorsSlugsEnum } from '@app/shared/enums/tutors-slugs.enum';
import { AuthService } from '@app/shared/services/auth.service';
import { PAYMENT_STATUS } from '@app/shared/enums/payment-status';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss'],
})
export class AccountsListComponent
  extends FilteredTable<PopulatedAccount>
  implements AfterViewInit
{
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<PopulatedAccount[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _accounts: AccountsService,
    private _ui: UiService,
    private _tutor: TutorService,
    private _auth: AuthService,
    private _translate: TranslateService
  ) {
    super();
    this.filterConfig = this._accounts.getAccountsListFilters();
    this._fetchData(this.data.page, this.data.limit);
  }

  ngAfterViewInit(): void {
    if (
      !this._tutor.isCompleted(TutorsSlugsEnum.CREATE_ACCOUNT) &&
      this._auth.getAuth()?.user.agency?.payment_status === PAYMENT_STATUS.PAYED
    )
      this.showTutor();
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

  showTutor() {
    accountTutor(this._tutor, this._translate).drive();
  }
}
