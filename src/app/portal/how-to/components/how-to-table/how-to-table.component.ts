import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { finalize, take } from 'rxjs';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';
import { TranslateService } from '@ngx-translate/core';
import {
  DeleteHowToModalComponent,
  DeleteHowToModalData,
  DeleteHowToModalResult,
} from 'src/app/portal/how-to/components/delete-how-to-modal/delete-how-to-modal.component';
import {
  TenantScopeModalComponent,
  TenantScopeModalData,
  TenantScopeModalResult,
} from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.component';

@Component({
  selector: 'app-how-to-table',
  templateUrl: './how-to-table.component.html',
  styleUrls: ['./how-to-table.component.scss'],
})
export class HowToTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() data?: HowToModel[];
  @Input() filtersActive: FilterActive[] = [];
  @Input() tenantId?: string;

  displayedColumns: string[] = ['drag', 'id', 'title', 'created_at', 'actions'];

  constructor(
    public _url: UrlService,
    private _ui: UiService,
    private _howTo: HowToService,
    private _t: TranslateService,
    private _dialog: MatDialog,
  ) {}

  onDrop(event: CdkDragDrop<HowToModel[]>): void {
    if (event.previousIndex === event.currentIndex || !this.data) return;

    moveItemInArray(this.data, event.previousIndex, event.currentIndex);

    const items = this.data.map((item, index) => ({ _id: item._id, order: index + 1 }));

    this._howTo
      .reorderHowTo({ tenant_id: this.tenantId, items })
      .subscribe({
        next: () => this.refresh.emit(),
        error: () => moveItemInArray(this.data!, event.currentIndex, event.previousIndex),
      });
  }

  deleteHowTo(howTo: HowToModel): void {
    if (!howTo.tenants?.length) {
      this._ui
        .showConfirmationModal({
          text: this._t.instant('PORTAL.HOW_TO.CONFIRM_DELETE'),
          type: UiModalTypeEnum.ERROR,
        })
        .pipe(take(1))
        .subscribe((resp: boolean) => {
          if (resp) this._executeFullDelete(howTo._id);
        });
      return;
    }

    const data: DeleteHowToModalData = { tenants: howTo.tenants, triggerTenantId: this.tenantId };
    this._dialog
      .open(DeleteHowToModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: DeleteHowToModalResult | null) => {
        if (result) this._executePartialDelete(howTo, result.tenantIds);
      });
  }

  private _executePartialDelete(howTo: HowToModel, tenantIdsToRemove: string[]): void {
    const remaining = (howTo.tenant_ids ?? []).filter(id => !tenantIdsToRemove.includes(id));

    if (remaining.length === 0) {
      this._executeFullDelete(howTo._id);
      return;
    }

    this._ui.showLoader();
    this._howTo
      .editHowTo({ tenant_ids: remaining }, howTo._id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.DELETED'));
        this.refresh.emit();
      });
  }

  private _executeFullDelete(_id: string): void {
    this._ui.showLoader();
    this._howTo
      .deleteHowTo(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.DELETED'));
        this.refresh.emit();
      });
  }

  openTenantStatusModal(howTo: HowToModel): void {
    if (!howTo.tenants?.length) return;

    const data: TenantScopeModalData = {
      titleKey: 'PORTAL.HOW_TO.STATUS_MODAL_TITLE',
      confirmButtonKey: 'PORTAL.HOW_TO.BTN_UPDATE_STATUS',
      tenants: howTo.tenants,
      statusToggle: true,
    };
    this._dialog
      .open(TenantScopeModalComponent, { data, panelClass: 'transparent-modal-container' })
      .afterClosed()
      .pipe(take(1))
      .subscribe((result: TenantScopeModalResult | null) => {
        if (result?.status) this._executeTenantStatusUpdate(howTo._id, result.tenantIds, result.status);
      });
  }

  private _executeTenantStatusUpdate(
    id: string,
    tenantIds: string[],
    status: 'ACTIVE' | 'INACTIVE',
  ): void {
    this._ui.showLoader();
    this._howTo
      .updateTenantStatus(id, tenantIds, status)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.HOW_TO.SUCCESS_TENANT_STATUS'));
          this.refresh.emit();
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.HOW_TO.ERROR_TENANT_STATUS')),
      });
  }
}
