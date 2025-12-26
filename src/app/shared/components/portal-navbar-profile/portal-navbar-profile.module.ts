import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalNavbarProfileComponent } from './portal-navbar-profile.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [PortalNavbarProfileComponent],
  imports: [CommonModule, OverlayPanelModule],
  exports: [PortalNavbarProfileComponent],
})
export class PortalNavbarProfileModule {}
