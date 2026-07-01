import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FilePreviewModalComponent } from './file-preview-modal.component';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FilePreviewModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  exports: [FilePreviewModalComponent],
})
export class FilePreviewModalModule {}
