import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnonNavbarModalService } from '../anon-navbar/anon-navbar-modal.service';

@Component({
  selector: 'app-anon-modal-forgot-password',
  templateUrl: './anon-modal-forgot-password.component.html',
  styleUrls: ['./anon-modal-forgot-password.component.scss'],
})
export class AnonModalForgotPasswordComponent {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _anonNavbarModal: AnonNavbarModalService
  ) {
    this.form = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
    });
  }

  forgotPassword() {
    console.log(this.form.value);
  }

  showLogin() {
    this._anonNavbarModal.openLogin();
  }
}
