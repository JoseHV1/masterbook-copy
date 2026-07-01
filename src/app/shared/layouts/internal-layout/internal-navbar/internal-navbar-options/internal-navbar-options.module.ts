import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalNavbarOptionsComponent } from './internal-navbar-options.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InternalNavbarOptionsComponent],
  imports: [CommonModule, OverlayPanelModule, TranslateModule],
  exports: [InternalNavbarOptionsComponent],
})
export class InternalNavbarOptionsModule {}
