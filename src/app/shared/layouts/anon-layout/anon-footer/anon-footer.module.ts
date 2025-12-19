import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonFooterComponent } from './anon-footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { ModalTicketModule } from '@app/shared/components/modal-ticket/modal-ticket.module';

@NgModule({
  declarations: [AnonFooterComponent],
  imports: [CommonModule, TranslateModule, ModalTicketModule],
  exports: [AnonFooterComponent],
})
export class AnonFooterModule {}
