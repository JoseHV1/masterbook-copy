import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChangePasswordComponent } from './modal-change-password.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalChangePasswordComponent],
  imports: [
    CommonModule,
    TranslateModule,
    CDKModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  exports: [ModalChangePasswordComponent],
})
export class ModalChangePasswordModule {}
