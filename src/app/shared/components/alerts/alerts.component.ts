import { Component, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [MessageService],
})
export class AlertsComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private _message: MessageService,
    private _ui: UiService,
    private _t: TranslateService
  ) {
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
      summary: this._t.instant('GENERAL.ALERT_TITLES.SUCCESS'),
      detail: message,
    });
  }

  showInfo(message: string) {
    this._message.add({
      severity: 'info',
      summary: this._t.instant('GENERAL.ALERT_TITLES.INFO'),
      detail: message,
    });
  }

  showWarning(message: string) {
    this._message.add({
      severity: 'warn',
      summary: this._t.instant('GENERAL.ALERT_TITLES.WARNING'),
      detail: message,
    });
  }

  showError(message: string) {
    this._message.add({
      severity: 'error',
      summary: this._t.instant('GENERAL.ALERT_TITLES.ERROR'),
      detail: message,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
