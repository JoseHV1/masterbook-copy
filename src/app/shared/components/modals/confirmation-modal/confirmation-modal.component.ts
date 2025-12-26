import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiModalConfig } from 'src/app/shared/models/ui-modal-config.model';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  config!: UiModalConfig;
  typeClass = '';

  constructor(
    private _dialog: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _config: UiModalConfig
  ) {
    this.config = this._config;
    this.typeClass = `back-${this.config.type}-color`;
  }

  close(response: boolean) {
    this._dialog.close(response);
  }
}
