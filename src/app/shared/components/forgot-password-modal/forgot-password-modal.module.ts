import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordModalComponent } from './forgot-password-modal.component';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputCodeModule } from '../form/input-code/input-code.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ForgotPasswordModalComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    TranslateModule,
    InputCodeModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [ForgotPasswordModalComponent],
})
export class ForgotPasswordModalModule {}
