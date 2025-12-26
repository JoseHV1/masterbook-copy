import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthModel } from '@app/shared/interfaces/models/auth.model';
import { TicketRequest } from '@app/shared/interfaces/requests/ticket/ticket-request';
import { AuthService } from '@app/shared/services/auth.service';
import { TicketService } from '@app/shared/services/ticket.service';
import { UiService } from '@app/shared/services/ui.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-modal-ticket',
  templateUrl: './modal-ticket.component.html',
  styleUrls: ['./modal-ticket.component.scss'],
})
export class ModalTicketComponent implements OnInit {
  form!: FormGroup;
  auth: AuthModel | null;

  constructor(
    private _ticket: TicketService,
    private _ui: UiService,
    private dialogRef: MatDialogRef<ModalTicketComponent>,
    private _auth: AuthService
  ) {
    this.form = this._ticket.createTicketForm();
    this.auth = this._auth.getAuth();
  }

  ngOnInit(): void {
    if (this.auth) {
      this.form.patchValue({
        email: this.auth.user.email,
      });

      this.form.get('email')?.disable();
    }
  }

  createTicket() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid) return;

    const valuesRaw = this.form.getRawValue();
    const req: TicketRequest = {
      user_id: this.auth?.user._id ?? 'User not logged in',
      email: valuesRaw.email,
      description: valuesRaw.description,
    };

    this._ui.showLoader();

    this._ticket
      .createTicket(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this.form.reset();
        this._ui.showAlertSuccess(
          'Ticket created successfully, you will receive a response from the support team within the next 24 hours.'
        );
        this.dialogRef.close();
      });
  }
}
