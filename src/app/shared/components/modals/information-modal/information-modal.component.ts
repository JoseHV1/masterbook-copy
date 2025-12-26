import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiModalConfig } from 'src/app/shared/models/ui-modal-config.model';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.scss'],
})
export class InformationModalComponent {
  config!: UiModalConfig;
  typeClass = '';

  parts: string[] = [];
  useLinkMode = false;

  constructor(
    private _dialog: MatDialogRef<InformationModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    private _config: UiModalConfig
  ) {
    this.config = this._config;
    this.typeClass = `back-${this.config.type}-color`;
    this.prepareParts();
  }

  private prepareParts() {
    const text = this.config?.text;
    const link = this.config?.link;

    if (text && link && /\{\{\s*link\s*\}\}/.test(text)) {
      this.parts = text.split(/\{\{\s*link\s*\}\}/);
      this.useLinkMode = true;
    }
  }

  close(response?: string) {
    this._dialog.close(response);
  }
}
