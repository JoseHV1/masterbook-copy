import { Component, Input } from '@angular/core';
import { PreviewInfo } from '../../../../shared/models/report.models';

@Component({
  selector: 'app-report-preview',
  templateUrl: './preview-report.component.html',
  styleUrls: ['./preview-report.component.scss'],
})
export class ReportPreviewComponent {
  @Input() loading = false;
  @Input() info: PreviewInfo | null = null;
}
