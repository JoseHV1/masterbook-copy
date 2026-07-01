import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TabUploadFileComponent } from './tab-upload-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ModalUploadFileModule } from '@app/shared/components/modal-upload-file/modal-upload-file.module';

@NgModule({
  declarations: [TabUploadFileComponent],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    ModalUploadFileModule,
  ],
  exports: [TabUploadFileComponent],
})
export class TabUploadFileModule {}
