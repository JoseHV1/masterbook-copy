import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminProfileFormComponent } from './admin-profile-form.component';
import { PictureSelectorModule } from 'src/app/shared/components/picture-selector/picture-selector.module';
import { ModalChangePasswordModule } from 'src/app/portal/profile/components/modal-change-password/modal-change-password.module';

@NgModule({
  declarations: [AdminProfileFormComponent],
  imports: [
    TranslateModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    PictureSelectorModule,
    ModalChangePasswordModule,
  ],
  exports: [AdminProfileFormComponent],
})
export class AdminProfileFormModule {}
