import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryButtonModule } from 'src/app/shared/components/primary-button/primary-button.module';
import { InputModule } from 'src/app/shared/components/form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AnonModalModule } from '../../shared/components/anon-modal/anon-modal.module';
import { PasswordChangeModalModule } from 'src/app/shared/components/password-change-modal/password-change-modal.module';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
  },
];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    PrimaryButtonModule,
    InputModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    TranslateModule,
    RouterModule,
    AnonModalModule,
    PasswordChangeModalModule,
  ],
  exports: [ResetPasswordComponent],
})
export class ResetPasswordModule {}
