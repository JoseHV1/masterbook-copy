import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabUploadFileComponent } from './tab-upload-file.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [TabUploadFileComponent],
  imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule],
  exports: [TabUploadFileComponent],
})
export class TabUploadFileModule {}
