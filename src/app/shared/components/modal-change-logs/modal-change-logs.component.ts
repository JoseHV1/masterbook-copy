import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogModel } from '@app/shared/interfaces/models/log.model';
import { LogsService } from '@app/shared/services/logs.service';
import { UiService } from '@app/shared/services/ui.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-change-logs',
  templateUrl: './modal-change-logs.component.html',
  styleUrls: ['./modal-change-logs.component.scss'],
})
export class ModalChangeLogsComponent implements OnInit {
  entityId = '';
  data: LogModel[] = [];

  groupedLogs: Record<string, LogModel[]> = {};
  groupedKeys: string[] = [];

  displayedColumns: string[] = [
    'changedBy',
    'oldValue',
    'newValue',
    'changeDate',
  ];

  constructor(
    private _ui: UiService,
    private readonly logsService: LogsService,
    @Inject(MAT_DIALOG_DATA) public dataModal: any
  ) {
    this.entityId = dataModal.entityId;
  }

  ngOnInit(): void {
    this.fetchLogs();
  }

  private fetchLogs(): void {
    this._ui.showLoader();
    this.logsService
      .getLogsByEntityId(this.entityId)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: logs => {
          this.data = this.flattenAllLogs(logs);
          this.groupLogs();
        },
        error: err => console.error(err),
      });
  }
  private flattenAllLogs(logs: LogModel[]): LogModel[] {
    const flattened: LogModel[] = [];

    for (const log of logs) {
      if (
        log.field === 'ALL' &&
        log.newValue &&
        typeof log.newValue === 'object'
      ) {
        for (const [field, value] of Object.entries(log.newValue)) {
          flattened.push({
            ...log,
            field,
            oldValue: null,
            newValue: value,
            changeType: 'Register',
          });
        }
      } else {
        flattened.push(log);
      }
    }

    return flattened;
  }

  private groupLogs(): void {
    this.groupedLogs = this.data.reduce((acc, log) => {
      if (!acc[log.field]) {
        acc[log.field] = [];
      }
      acc[log.field].push(log);
      return acc;
    }, {} as Record<string, LogModel[]>);

    this.groupedKeys = Object.keys(this.groupedLogs);
  }

  formatValue(value: any): string {
    if (value === null || value === undefined || value === '') {
      return '---';
    }

    if (value instanceof Date) {
      return value.toLocaleString();
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return value.toString();
  }

  formatDateWithHour(value: any): string {
    if (!value) return '---';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '---';

    const pad = (n: number) => n.toString().padStart(2, '0');
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());

    return `Date: ${day}/${month}/${year} Hour: ${hour}:${minute}`;
  }

  formatFieldName(field: string): string {
    if (!field) return '---';
    return field
      .replace(/_id$/, '')
      .replace(/_/g, ' ')
      .replace(
        /\w\S*/g,
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      );
  }
}
