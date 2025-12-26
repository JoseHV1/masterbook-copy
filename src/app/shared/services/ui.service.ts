import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { InformationModalComponent } from '../components/modals/information-modal/information-modal.component';
import { UiModalConfig } from '../models/ui-modal-config.model';
import { UiModalTypeEnum } from '../enums/ui-modal-type.enum';
import { ConfirmationModalComponent } from '../components/modals/confirmation-modal/confirmation-modal.component';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private alertInfoSubject: Subject<string> = new Subject<string>();
  private alertWarningSubject: Subject<string> = new Subject<string>();
  private alertSuccessSubject: Subject<string> = new Subject<string>();
  private alertErrorSubject: Subject<string> = new Subject<string>();
  private loaderVisible: Subject<boolean> = new Subject<boolean>();

  public readonly alertInfo$: Observable<string> =
    this.alertInfoSubject.asObservable();
  public readonly alertWarning$: Observable<string> =
    this.alertWarningSubject.asObservable();
  public readonly alertSuccess$: Observable<string> =
    this.alertSuccessSubject.asObservable();
  public readonly alertError$: Observable<string> =
    this.alertErrorSubject.asObservable();
  public readonly loaderVisible$: Observable<boolean> =
    this.loaderVisible.asObservable();

  constructor(public _dialog: MatDialog) {}

  showLoader(): void {
    this.loaderVisible.next(true);
  }

  hideLoader(): void {
    this.loaderVisible.next(false);
  }

  showAlertInfo(message: string): void {
    this.alertInfoSubject.next(message);
  }

  showAlertWarning(message: string): void {
    this.alertWarningSubject.next(message);
  }

  showAlertSuccess(message: string): void {
    this.alertSuccessSubject.next(message);
  }

  showAlertError(message: string): void {
    this.alertErrorSubject.next(message);
  }

  showConfirmationModal(config: Partial<UiModalConfig>): Observable<boolean> {
    return this._dialog
      .open(ConfirmationModalComponent, {
        data: this._getUiModalConfig(config),
        disableClose: true,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed();
  }

  showInformationModal(config: Partial<UiModalConfig>): Observable<string> {
    return this._dialog
      .open(InformationModalComponent, {
        data: this._getUiModalConfig(config),
        disableClose: true,
        panelClass: 'transparent-modal-container',
      })
      .afterClosed();
  }

  private _getUiModalConfig(config: Partial<UiModalConfig>): UiModalConfig {
    return {
      text: config.text ?? 'Information',
      title: config.title ?? 'Confirm',
      type: config.type ?? UiModalTypeEnum.INFO,
      link: config.link ?? { name: '', url: [] },
      additionalButton: config.additionalButton ?? false,
    };
  }
}
