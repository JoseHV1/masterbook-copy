import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FilePreviewModalComponent } from './file-preview-modal.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FilePreviewModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  exports: [FilePreviewModalComponent],
})
export class FilePreviewModalModule {}
