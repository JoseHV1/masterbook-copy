import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UploadFileModel } from '../../interfaces/models/upload-file.model';

@Component({
  selector: 'app-upload-file-errors-modal',
  templateUrl: './upload-file-errors-modal.component.html',
  styleUrls: ['./upload-file-errors-modal.component.scss'],
})
export class UploadFileErrorsModalComponent {
  rowsWithErrors: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: UploadFileModel) {
    this.rowsWithErrors = data?.rows_with_errors ?? [];
  }

  getKeys(obj: Record<string, any>): string[] {
    return obj ? Object.keys(obj) : [];
  }

  formatKey(key: string): string {
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  formatValue(value: any, key: string): string {
    if (value === null || value === undefined || value === '') return '—';

    if (key.toLowerCase().includes('date')) {
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    }

    return value;
  }
}
