import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';

@Component({
  selector: 'app-policy-account-selector',
  templateUrl: './policy-account-selector.component.html',
  styleUrls: ['./policy-account-selector.component.scss'],
})
export class PolicyAccountSelectorComponent implements OnInit {
  @Output() emitSelectedAccount: EventEmitter<PopulatedAccount> =
    new EventEmitter();
  selectedAccount?: PopulatedAccount;
  account_id?: string;

  private isInitialRouteLoad = false;

  constructor(private _activateRoute: ActivatedRoute) {}

  ngOnInit(): void {
    const idFromRoute = this._activateRoute.snapshot.queryParams['account'];
    if (idFromRoute) {
      this.account_id = idFromRoute;
      this.isInitialRouteLoad = true;
    }
  }

  handleAccountSelection(
    event: PopulatedAccount | PopulatedAccount[] | undefined
  ): void {
    this.selectedAccount = event as PopulatedAccount | undefined;

    if (this.selectedAccount && this.isInitialRouteLoad) {
      this.isInitialRouteLoad = false;
      this.sendSelectedAccount();
    }
  }

  sendSelectedAccount(): void {
    if (this.selectedAccount) {
      this.emitSelectedAccount.emit(this.selectedAccount);
    }
  }

  reset(): void {
    this.selectedAccount = undefined;
    this.isInitialRouteLoad = false;
  }
}
