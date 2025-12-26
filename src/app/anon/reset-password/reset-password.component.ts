import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  form!: FormGroup;
  visible: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      passwordConfirm: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  invalidMinLength(field: string) {
    return this.form.get(field)?.hasError('minlength');
  }

  resetPassword() {
    if (!this.form.invalid) {
      this.visible = true;
    }
  }
}
