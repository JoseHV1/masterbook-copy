import { Component, OnInit } from '@angular/core';
import {
  ReportFilters,
  HistoryItem,
  PreviewInfo,
} from '../../shared/models/report.models';
import { ReportService } from '../../shared/services/report.service';
import { UiService } from '@app/shared/services/ui.service';

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

  constructor(private reports: ReportService, private _ui: UiService) {}

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

    const payload =
      f.reportType === 'accounts' ? { ...f, location: 'Toronto' } : f;

    this.reports.generateReport(payload).subscribe({
      next: () => {
        this.loadHistory();
        this._ui.showAlertSuccess('Report generated successfully');
      },
      error: () => this._ui.hideLoader(),
      complete: () => this._ui.hideLoader(),
    });
  }

  onDownload(item: HistoryItem) {
    if (item?.url) {
      window.open(item.url, '_blank');
    }
  }
}
