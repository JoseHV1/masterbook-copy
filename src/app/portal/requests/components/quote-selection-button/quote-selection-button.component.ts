import { Component, EventEmitter, Input, Output } from '@angular/core';
import { brokerRolesDataset } from 'src/app/shared/datatsets/roles.datasets';
import { QuoteStatusEnum } from 'src/app/shared/enums/quote-status.enum';
import { RequestStatusEnum } from 'src/app/shared/enums/request-status.enum';
import { AuthModel } from 'src/app/shared/interfaces/models/auth.model';
import { PopulatedQuoteModel } from 'src/app/shared/interfaces/models/quote.model';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-quote-selection-button',
  templateUrl: './quote-selection-button.component.html',
  styleUrls: ['./quote-selection-button.component.scss'],
})
export class QuoteSelectionButtonComponent {
  @Input() quote!: PopulatedQuoteModel;
  @Input() request!: PopulatedRequestModel;
  @Output() changeStatus: EventEmitter<QuoteStatusEnum> = new EventEmitter();
  @Output() createPolicy: EventEmitter<PopulatedQuoteModel> =
    new EventEmitter();

  isAgent: boolean;
  QuoteStatusEnum = QuoteStatusEnum;
  RequestStatusEnum = RequestStatusEnum;

  constructor(private _auth: AuthService) {
    const currentUser = (this._auth.getAuth() as AuthModel).user;
    this.isAgent = currentUser?.role
      ? brokerRolesDataset.includes(currentUser.role)
      : false;
  }

  toggleStatus(): void {
    if (this.request.status === RequestStatusEnum.CLOSED) return;

    const status =
      this.quote.status === QuoteStatusEnum.ACCEPTED
        ? QuoteStatusEnum.NOT_ACCEPTED
        : QuoteStatusEnum.ACCEPTED;
    this.changeStatus.emit(status);
  }

  goToPolicy(): void {
    if (this.quote.status !== QuoteStatusEnum.ACCEPTED) return;
    this.createPolicy.emit(this.quote);
  }
}
