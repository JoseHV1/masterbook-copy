import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FloatingActionsComponent } from './floating-actions.component';
import { ModalTicketModule } from '../modal-ticket/modal-ticket.module';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FloatingActionsComponent],
  imports: [CommonModule, ModalTicketModule, MatIconModule, TranslateModule],
  exports: [FloatingActionsComponent],
})
export class FloatingActionsModule {}
