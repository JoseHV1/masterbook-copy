import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalTicketComponent } from '@app/shared/components/modal-ticket/modal-ticket.component';

@Component({
  selector: 'app-anon-footer',
  templateUrl: './anon-footer.component.html',
  styleUrls: ['./anon-footer.component.scss'],
})
export class AnonFooterComponent {
  currentYear: number = new Date().getFullYear();

  constructor(private router: Router, private dialog: MatDialog) {}

  openModalTicket() {
    this.dialog.open(ModalTicketComponent, {
      panelClass: 'custom-dialog-container',
    });
  }
}
