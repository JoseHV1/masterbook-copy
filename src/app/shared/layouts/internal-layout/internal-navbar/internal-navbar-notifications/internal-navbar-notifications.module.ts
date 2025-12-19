import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalNavbarNotificationsComponent } from './internal-navbar-notifications.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [InternalNavbarNotificationsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  exports: [InternalNavbarNotificationsComponent],
})
export class InternalNavbarNotificationsModule {}
