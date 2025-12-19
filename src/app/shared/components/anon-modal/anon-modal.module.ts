import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonModalComponent } from './anon-modal.component';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [AnonModalComponent],
  imports: [CommonModule, DialogModule],
  exports: [AnonModalComponent],
})
export class AnonModalModule {}
