import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadFileErrorsModalComponent } from './upload-file-errors-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [UploadFileErrorsModalComponent],
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule, TranslateModule],
  exports: [UploadFileErrorsModalComponent],
})
export class UploadFileErrorsModalModule {}
