import { Component, OnInit } from '@angular/core';
import {
  ReportFilters,
  HistoryItem,
  PreviewInfo,
} from '../../shared/models/report.models';
import { ReportService } from '../../shared/services/report.service';
import { UiService } from '@app/shared/services/ui.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  previewLoading = false;
  previewInfo: PreviewInfo | null = null;
  historyLoading = false;
  history: HistoryItem[] = [];
  lastFilters: ReportFilters | null = null;

  constructor(
    private reports: ReportService,
    private _ui: UiService,
    private _uploadFile: UploadFileService,
    private _t: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory() {
    this.historyLoading = true;
    this.reports.getHistory().subscribe(h => {
      this.history = h;
      this.historyLoading = false;
    });
  }

  onChanged(f: ReportFilters) {
    this.lastFilters = f;
  }

  onPreview(f: ReportFilters) {
    this.previewLoading = true;
    this.reports.generatePreview(f).subscribe(info => {
      this.previewInfo = info;
      this.previewLoading = false;
    });
  }

  onGenerate(f: ReportFilters) {
    this._ui.showLoader();

    this.reports.generateReport(f).subscribe({
      next: () => {
        this.loadHistory();
        this._ui.showAlertSuccess(this._t.instant('PORTAL.REPORTS.GENERATED'));
      },
      error: () => this._ui.hideLoader(),
      complete: () => this._ui.hideLoader(),
    });
  }

  onDownload(item: HistoryItem) {
    /*window.open(item.url, '_blank');*/
    if (item?.url) {
      this._uploadFile.getUrlFile(item.url).subscribe({
        next: res => {
          if (res) {
            window.open(res, '_blank');
          }
        },
        error: err => {
          console.error('Error al obtener el acceso al archivo', err);
        },
      });
    }
  }
}
