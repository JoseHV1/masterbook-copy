import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize, take } from 'rxjs';
import { RequestStatusEnum } from 'src/app/shared/enums/request-status.enum';
import { PopulatedRequestModel } from 'src/app/shared/interfaces/models/request.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { RequestsService } from 'src/app/shared/services/requests.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { RejectRequestModalComponent } from '../reject-policy-modal/reject-request-modal.component';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { Location } from '@angular/common';

@Component({
  selector: 'app-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: ['./requests-table.component.scss'],
})
export class RequestsTableComponent implements OnInit {
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() data?: PopulatedRequestModel[];
  @Input() filtersActive: FilterActive[] = [];
  REQUEST_STATUS = RequestStatusEnum;

  displayedColumns: string[] = [
    'id',
    'account_name',
    'policy_type',
    'insure_object',
    'broker_fullname',
    'coverage',
    'status',
    'category',
    'created_at',
    'document_url',
  ];
  urlDetails!: string;

  constructor(
    public _url: UrlService,
    private _ui: UiService,
    private _request: RequestsService,
    private _dialog: MatDialog,
    private _location: Location
  ) {}

  ngOnInit(): void {
    const path = this._location.path();
    this.urlDetails = path.includes('/portal-client')
      ? '/portal-client/requests'
      : '/portal/requests';

    if (path.includes('/portal/')) {
      this.displayedColumns.push('actions');
    }
  }

  deleteRequest(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this request?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._request
      .deleteRequest(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('Request deleted successfully');
        this.refresh.emit();
      });
  }

  openRejectRequestModal(element: PopulatedRequestModel) {
    this._dialog
      .open(RejectRequestModalComponent, {
        data: { request: element },
        autoFocus: false,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe(resp => {
        if (resp) this.refresh.emit();
      });
  }
}
