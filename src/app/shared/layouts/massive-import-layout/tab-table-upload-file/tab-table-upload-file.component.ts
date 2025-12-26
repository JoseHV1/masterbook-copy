import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileErrorsModalComponent } from 'src/app/shared/components/upload-file-errors-modal/upload-file-errors-modal.component';
import { UploadFileModel } from 'src/app/shared/interfaces/models/upload-file.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-tab-table-upload-file',
  templateUrl: './tab-table-upload-file.component.html',
  styleUrls: ['./tab-table-upload-file.component.scss'],
})
export class TabTableUploadFileComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();
  @Input() data?: UploadFileModel[];
  @Input() filtersActive: FilterActive[] = [];

  displayedColumns: string[] = [
    'upload_at',
    'file_name',
    'upload_for',
    'total_rows',
    'total_errors',
    'total_success',
    'status',
    'actions',
  ];

  constructor(public _url: UrlService, private dialog: MatDialog) {}

  openModalErrors(element: UploadFileModel) {
    this.dialog.open(UploadFileErrorsModalComponent, {
      width: '80%',
      maxWidth: '900px',
      data: element,
      panelClass: 'custom-dialog-panel',
    });
  }

  openFile(url: string) {
    window.open(url, '_blank');
  }
}
