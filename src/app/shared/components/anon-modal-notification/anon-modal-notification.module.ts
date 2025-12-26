import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonModalNotificationComponent } from './anon-modal-notification.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnonModalNotificationComponent],
  imports: [CommonModule, TranslateModule],
  exports: [AnonModalNotificationComponent],
})
export class AnonModalNotificationModule {}
