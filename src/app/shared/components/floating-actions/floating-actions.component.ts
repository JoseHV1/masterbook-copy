import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalTicketComponent } from '../modal-ticket/modal-ticket.component';

@Component({
  selector: 'app-floating-actions',
  templateUrl: './floating-actions.component.html',
  styleUrls: ['./floating-actions.component.scss'],
})
export class FloatingActionsComponent {
  @Input() surveyUrl!: string;
  @Input() contactNumberBroker?: string;
  @Input() isInsured: boolean = false;

  constructor(private dialog: MatDialog) {}

  openModalTicket() {
    this.dialog.open(ModalTicketComponent, {
      panelClass: 'custom-dialog-container',
    });
  }
}
