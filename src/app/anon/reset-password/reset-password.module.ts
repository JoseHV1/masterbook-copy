import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResetPasswordComponent } from './reset-password.component';
import { RouterModule, Routes } from '@angular/router';
import { PrimaryButtonModule } from '../../shared/components/primary-button/primary-button.module';
import { TranslateModule } from '@ngx-translate/core';
import { InputModule } from 'src/app/shared/components/form/input/input.module';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from '../../shared/components/form/textarea/textarea.module';

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
    TranslateModule,
    PrimaryButtonModule,
    RouterModule.forChild(routes),
    InputModule,
    TextareaModule,
    FormsModule,
  ],
})
export class ResetPasswordModule {}
