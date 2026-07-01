import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';
import { AdminTenantSelectorComponent } from './admin-tenant-selector.component';

@NgModule({
  declarations: [AdminTenantSelectorComponent],
  imports: [CommonModule, OverlayPanelModule, TranslateModule],
  exports: [AdminTenantSelectorComponent],
})
export class AdminTenantSelectorModule {}
