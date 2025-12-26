import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AnonNavbarModalService } from '../anon-navbar/anon-navbar-modal.service';

@Component({
  selector: 'app-anon-modal-singup',
  templateUrl: './anon-modal-singup.component.html',
  styleUrls: ['./anon-modal-singup.component.scss'],
})
export class AnonModalSingupComponent implements OnInit {
  form!: FormGroup;
  countries!: any[];
  selectedCountry!: string;

  constructor(
    private formBuilder: FormBuilder,
    private _anonNavbarModal: AnonNavbarModalService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$'),
        ],
      ],
      country: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rectifyPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.countries = [
      { name: 'Australia', code: 'AU' },
      { name: 'Brazil', code: 'BR' },
      { name: 'China', code: 'CN' },
      { name: 'Egypt', code: 'EG' },
      { name: 'France', code: 'FR' },
      { name: 'Germany', code: 'DE' },
      { name: 'India', code: 'IN' },
      { name: 'Japan', code: 'JP' },
      { name: 'Spain', code: 'ES' },
      { name: 'United States', code: 'US' },
    ];
  }

  singUp() {
    console.log(this.form.value);
    this._anonNavbarModal.openNotification();
  }
}
