import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HistoryItem } from '../../../../shared/models/report.models';

@Component({
  selector: 'app-report-history',
  templateUrl: './download-center.component.html',
  styleUrls: ['./download-center.component.scss'],
})
export class ReportHistoryComponent {
  @Input() items: HistoryItem[] | null = [];
  @Input() loading = false;
  @Output() download = new EventEmitter<HistoryItem>();
}
