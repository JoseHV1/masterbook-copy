import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalNavbarNotificationComponent } from './portal-navbar-notification.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [PortalNavbarNotificationComponent],
  imports: [CommonModule, TooltipModule],
  exports: [PortalNavbarNotificationComponent],
})
export class PortalNavbarNotificationModule {}
