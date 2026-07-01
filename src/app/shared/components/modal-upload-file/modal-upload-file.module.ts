import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ModalUploadFileComponent } from './modal-upload-file.component';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ModalUploadFileComponent],
  imports: [
    TranslateModule,
    CommonModule,
    CDKModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [ModalUploadFileComponent],
})
export class ModalUploadFileModule {}
