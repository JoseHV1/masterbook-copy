import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnonNavbarModalService } from '../anon-navbar/anon-navbar-modal.service';

@Component({
  selector: 'app-anon-modal-login',
  templateUrl: './anon-modal-login.component.html',
  styleUrls: ['./anon-modal-login.component.scss'],
})
export class AnonModalLoginComponent {
  formLogin!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _anonNavbarModal: AnonNavbarModalService
  ) {
    this.formLogin = this.formBuilder.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log(this.formLogin.value);
  }

  showModalSignup() {
    this._anonNavbarModal.openSignUp();
  }

  showModalForgot() {
    this._anonNavbarModal.openForgotPassword();
  }
}
