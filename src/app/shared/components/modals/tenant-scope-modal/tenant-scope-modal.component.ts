import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { DropdownOption } from 'src/core/cdk/dropDown/dropdown.component';

export interface TenantScopeModalTenant {
  _id: string;
  name: string;
  code: string;
}

export interface TenantScopeModalData {
  titleKey: string;
  confirmButtonKey: string;
  tenants: TenantScopeModalTenant[];
  triggerTenantId?: string;
  /** When true, shows a target-status choice (Active/Inactive) alongside the tenant selection. */
  statusToggle?: boolean;
}

export interface TenantScopeModalResult {
  tenantIds: string[];
  status?: 'ACTIVE' | 'INACTIVE';
}

@Component({
  selector: 'app-tenant-scope-modal',
  templateUrl: './tenant-scope-modal.component.html',
  styleUrls: ['./tenant-scope-modal.component.scss'],
})
export class TenantScopeModalComponent {
  mode: 'single' | 'multiple';
  triggerTenant: TenantScopeModalTenant | null;
  tenantOptions: DropdownOption[];
  selectedTenantIds: string[] = [];
  showModeChoice: boolean;
  targetStatus: 'ACTIVE' | 'INACTIVE' = 'INACTIVE';

  constructor(
    private _dialog: MatDialogRef<TenantScopeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TenantScopeModalData,
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

    const result: TenantScopeModalResult = {
      tenantIds,
      ...(this.data.statusToggle ? { status: this.targetStatus } : {}),
    };
    this._dialog.close(result);
  }
}
