import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalNavbarOptionsComponent } from './internal-navbar-options.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [InternalNavbarOptionsComponent],
  imports: [CommonModule, OverlayPanelModule],
  exports: [InternalNavbarOptionsComponent],
})
export class InternalNavbarOptionsModule {}
