import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonModalNotificationComponent } from './anon-modal-notification.component';
import { DialogModule } from 'primeng/dialog';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimaryButtonModule } from '../primary-button/primary-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnonModalNotificationComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputModule,
    ReactiveFormsModule,
    PrimaryButtonModule,
    TranslateModule,
  ],
  exports: [AnonModalNotificationComponent],
})
export class AnonModalNotificationModule {}
