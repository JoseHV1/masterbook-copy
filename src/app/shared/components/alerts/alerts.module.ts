import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertsComponent } from './alerts.component';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [AlertsComponent],
  imports: [CommonModule, ToastModule],
  exports: [AlertsComponent],
})
export class AlertsModule {}
