import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalNavbarButtonComponent } from './portal-navbar-button.component';
import { BadgeModule } from 'primeng/badge';

@NgModule({
  declarations: [PortalNavbarButtonComponent],
  imports: [CommonModule, BadgeModule],
  exports: [PortalNavbarButtonComponent],
})
export class PortalNavbarButtonModule {}
