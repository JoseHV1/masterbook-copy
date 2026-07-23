import { Component, Input, OnChanges } from '@angular/core';
import { FilteredTable } from '../../classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from '../../interfaces/models/paginated-response.model';
import { FilterWrapperModel } from '../../models/filters.model';
import { UiService } from '../../services/ui.service';
import { UploadFileModel } from '../../interfaces/models/upload-file.model';
import { UploadFileService } from '../../services/upload_file.service';
import { finalize } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const ENTITY_LABEL_KEYS: Record<string, string> = {
  accounts: 'SHARED.SIDEBAR_MENU.ACCOUNTS',
  policies: 'SHARED.SIDEBAR_MENU.POLICIES',
};

@Component({
  selector: 'app-massive-import-layout',
  templateUrl: './massive-import-layout.component.html',
  styleUrls: ['./massive-import-layout.component.scss'],
})
export class MassiveImportLayoutComponent
  extends FilteredTable<UploadFileModel>
  implements OnChanges
{
  @Input() entity!: string;
  selectedTabIndex: number = 0;
  filterConfig!: FilterWrapperModel;
  data: PaginatedResponse<UploadFileModel[]> = {
    records: [],
    page: 0,
    limit: 10,
    total_records: 0,
  };

  constructor(
    private _ui: UiService,
    private _uploadFile: UploadFileService,
    private _t: TranslateService
  ) {
    super();
    this.filterConfig = this._uploadFile.getUploadFileListFilters();
  }

  private get entityLabel(): string {
    const key = ENTITY_LABEL_KEYS[this.entity];
    return key ? this._t.instant(key) : this.entity;
  }

  get createTabLabel(): string {
    return this._t.instant('PORTAL.SHARED.CREATE_TAB', { entity: this.entityLabel });
  }

  get tableUploadTabLabel(): string {
    return this._t.instant('PORTAL.SHARED.TABLE_UPLOAD_TAB', { entity: this.entityLabel });
  }

  ngOnChanges(): void {
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, hitsPerPAge?: number): void {
    const hits = hitsPerPAge ?? this.data.limit;
    this._ui.showLoader();
    this._uploadFile
      .getUploadsFiles(page, hits, this.entity, this.filterText)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp;
      });
  }

  refresh(): void {
    this._fetchData(this.data.page - 1, this.data.limit);
  }

  onUploadCompleted() {
    this.selectedTabIndex = 2;
    this.refresh();
  }
}
