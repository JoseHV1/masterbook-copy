import { Component, Input, OnChanges } from '@angular/core';
import { FilteredTable } from '../../classes/filtered-table-base/filtered-table.base';
import { PaginatedResponse } from '../../interfaces/models/paginated-response.model';
import { FilterWrapperModel } from '../../models/filters.model';
import { UiService } from '../../services/ui.service';
import { UploadFileModel } from '../../interfaces/models/upload-file.model';
import { UploadFileService } from '../../services/upload_file.service';
import { finalize } from 'rxjs';

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

  constructor(private _ui: UiService, private _uploadFile: UploadFileService) {
    super();
    this.filterConfig = this._uploadFile.getUploadFileListFilters();
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
