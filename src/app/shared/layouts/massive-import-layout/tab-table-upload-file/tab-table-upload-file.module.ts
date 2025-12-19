import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabTableUploadFileComponent } from './tab-table-upload-file.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UploadFileErrorsModalModule } from 'src/app/shared/components/upload-file-errors-modal/upload-file-errors-modal.module';

@NgModule({
  declarations: [TabTableUploadFileComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    UploadFileErrorsModalModule,
  ],
  exports: [TabTableUploadFileComponent],
})
export class TabTableUploadFileModule {}
