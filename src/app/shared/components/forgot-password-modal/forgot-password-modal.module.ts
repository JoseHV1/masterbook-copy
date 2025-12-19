import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordModalComponent } from './forgot-password-modal.component';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputCodeModule } from '../form/input-code/input-code.module';

@NgModule({
  declarations: [ForgotPasswordModalComponent],
  imports: [
    CommonModule,
    InputModule,
    ReactiveFormsModule,
    TranslateModule,
    InputCodeModule,
  ],
  exports: [ForgotPasswordModalComponent],
})
export class ForgotPasswordModalModule {}
