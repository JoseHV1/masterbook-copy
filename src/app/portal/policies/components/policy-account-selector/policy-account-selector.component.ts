import { Component, EventEmitter, Output } from '@angular/core';
import { PopulatedAccount } from 'src/app/shared/interfaces/models/accounts.model';

@Component({
  selector: 'app-policy-account-selector',
  templateUrl: './policy-account-selector.component.html',
  styleUrls: ['./policy-account-selector.component.scss'],
})
export class PolicyAccountSelectorComponent {
  @Output() emitSelectedAccount: EventEmitter<PopulatedAccount> =
    new EventEmitter();
  selectedAccount?: PopulatedAccount | undefined;
  account_id?: string;

  constructor() {}

  handleAccountSelection(
    event: PopulatedAccount | PopulatedAccount[] | undefined
  ): void {
    this.selectedAccount = event as PopulatedAccount | undefined;
  }

  reset(): void {
    this.selectedAccount = undefined;
  }

  sendSelectedAccount(): void {
    this.emitSelectedAccount.emit(this.selectedAccount);
  }
}
