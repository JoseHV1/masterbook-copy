import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalNavbarComponent } from './internal-navbar.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InternalNavbarOptionsModule } from './internal-navbar-options/internal-navbar-options.module';
import { InternalNavbarNotificationsModule } from './internal-navbar-notifications/internal-navbar-notifications.module';

@NgModule({
  declarations: [InternalNavbarComponent],
  imports: [
    CommonModule,
    OverlayPanelModule,
    InternalNavbarOptionsModule,
    InternalNavbarNotificationsModule,
  ],
  exports: [InternalNavbarComponent],
})
export class InternalNavbarModule {}
