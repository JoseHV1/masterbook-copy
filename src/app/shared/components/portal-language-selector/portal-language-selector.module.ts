import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PoprtalLanguageSelectorComponent } from './portal-language-selector.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PoprtalLanguageSelectorComponent],
  imports: [CommonModule, OverlayPanelModule, TranslateModule],
  exports: [PoprtalLanguageSelectorComponent],
})
export class PortalLanguageSelectorModule {}
