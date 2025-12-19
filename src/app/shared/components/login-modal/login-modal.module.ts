import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModalComponent } from './login-modal.component';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LoginModalComponent],
  imports: [CommonModule, InputModule, ReactiveFormsModule, TranslateModule],
  exports: [LoginModalComponent],
})
export class LoginModalModule {}
