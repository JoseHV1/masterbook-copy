import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalTicketComponent } from './modal-ticket.component';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [ModalTicketComponent],
  imports: [
    CommonModule,
    CDKModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [ModalTicketComponent],
})
export class ModalTicketModule {}
