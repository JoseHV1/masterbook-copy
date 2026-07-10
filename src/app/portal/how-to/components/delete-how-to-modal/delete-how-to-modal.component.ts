import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';

export interface DeleteHowToModalTenant {
  _id: string;
  name: string;
  code: string;
}

export interface DeleteHowToModalData {
  tenants: DeleteHowToModalTenant[];
  triggerTenantId?: string;
}

export interface DeleteHowToModalResult {
  tenantIds: string[];
}

@Component({
  selector: 'app-delete-how-to-modal',
  templateUrl: './delete-how-to-modal.component.html',
  styleUrls: ['./delete-how-to-modal.component.scss'],
})
export class DeleteHowToModalComponent {
  mode: 'single' | 'multiple';
  triggerTenant: DeleteHowToModalTenant | null;
  tenantOptions: DropdownOption[];
  selectedTenantIds: string[] = [];
  showModeChoice: boolean;

  constructor(
    private _dialog: MatDialogRef<DeleteHowToModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteHowToModalData,
    private _t: TranslateService,
  ) {
    this.showModeChoice = data.tenants.length > 1;

    this.triggerTenant = this.showModeChoice
      ? data.tenants.find(t => t._id === data.triggerTenantId) ?? null
      : data.tenants[0] ?? null;
    this.mode = this.triggerTenant ? 'single' : 'multiple';

    this.tenantOptions = [
      { code: '', name: this._t.instant('PORTAL.HOW_TO.DETAIL.ALL_TENANTS') },
      ...data.tenants.map(t => ({ code: t._id, name: `${t.name} (${t.code})` })),
    ];
  }

  get canConfirm(): boolean {
    return this.mode === 'single' ? !!this.triggerTenant : this.selectedTenantIds.length > 0;
  }

  cancel(): void {
    this._dialog.close(null);
  }

  confirm(): void {
    if (!this.canConfirm) return;

    const tenantIds =
      this.mode === 'single'
        ? [this.triggerTenant!._id]
        : this.selectedTenantIds.includes('')
        ? this.data.tenants.map(t => t._id)
        : this.selectedTenantIds;

    const result: DeleteHowToModalResult = { tenantIds };
    this._dialog.close(result);
  }
}
