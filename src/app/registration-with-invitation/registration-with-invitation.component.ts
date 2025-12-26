import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from './dataService';

@Component({
  selector: 'app-registration-with-invitation',
  templateUrl: './registration-with-invitation.component.html',
  styleUrls: ['./registration-with-invitation.component.scss'],
})
export class RegistrationWithInvitationComponent implements OnInit {
  token: any = 0;
  form!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    // Initialize form with form builder
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', Validators.required],
    });
  }

  // Getter for easy access to form controls
  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    const userDataWithToken = { ...this.form.value, token: this.token };
    this.dataService
      .sendUserData(userDataWithToken)
      .then(response => {})
      .catch(error => {
        console.error('Backend Error:', error);
      });
  }

  // Helper function to check if a form field is invalid
  fieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
}
