import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalLayoutComponent } from './portal-layout.component';
import { PortalNavbarModule } from '../../components/portal-navbar/portal-navbar.module';
import { PortalMenuModule } from '../../components/portal-menu/portal-menu.module';
@NgModule({
  declarations: [PortalLayoutComponent],
  imports: [CommonModule, PortalNavbarModule, PortalMenuModule],
  exports: [PortalLayoutComponent],
})
export class PortalLayoutModule {}
