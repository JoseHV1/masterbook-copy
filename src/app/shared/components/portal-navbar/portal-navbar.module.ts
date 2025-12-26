import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalNavbarComponent } from './portal-navbar.component';
import { PortalLanguageSelectorModule } from '../portal-language-selector/portal-language-selector.module';
import { PortalNavbarButtonModule } from '../portal-navbar-button/portal-navbar-button.module';
import { PortalNavbarNotificationModule } from '../portal-navbar-notification/portal-navbar-notification.module';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TooltipModule } from 'primeng/tooltip';
import { PortalNavbarProfileModule } from '../portal-navbar-profile/portal-navbar-profile.module';

@NgModule({
  declarations: [PortalNavbarComponent],
  imports: [
    CommonModule,
    PortalLanguageSelectorModule,
    PortalNavbarButtonModule,
    PortalNavbarNotificationModule,
    OverlayPanelModule,
    TooltipModule,
    PortalNavbarProfileModule,
  ],
  exports: [PortalNavbarComponent],
})
export class PortalNavbarModule {}
