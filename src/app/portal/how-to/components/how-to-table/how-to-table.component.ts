import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalize, take } from 'rxjs';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';
import { UiModalTypeEnum } from 'src/app/shared/enums/ui-modal-type.enum';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';

@Component({
  selector: 'app-how-to-table',
  templateUrl: './how-to-table.component.html',
  styleUrls: ['./how-to-table.component.scss'],
})
export class HowToTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() data?: HowToModel[];
  @Input() filtersActive: FilterActive[] = [];

  displayedColumns: string[] = ['id', 'title', 'created_at', 'actions'];

  constructor(
    public _url: UrlService,
    private _ui: UiService,
    private _howTo: HowToService
  ) {}

  deleteHowTo(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this video?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._howTo
      .deleteHowTo(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('video deleted successfully');
        this.refresh.emit();
      });
  }
}
