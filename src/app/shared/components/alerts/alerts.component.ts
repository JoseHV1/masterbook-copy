import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [MessageService],
})
export class AlertsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(private _message: MessageService, private _ui: UiService) {
    this._ui.alertInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.showInfo(message));

    this._ui.alertWarning$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.showWarning(message));

    this._ui.alertSuccess$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.showSuccess(message));

    this._ui.alertError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(message => this.showError(message));
  }

  showSuccess(message: string) {
    this._message.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }

  showInfo(message: string) {
    this._message.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }

  showWarning(message: string) {
    this._message.add({
      severity: 'warn',
      summary: 'Warn',
      detail: message,
    });
  }

  showError(message: string) {
    this._message.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
