import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingupModalComponent } from './sign-up-modal.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SingupModalComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    MatIconModule,
  ],
  exports: [SingupModalComponent],
})
export class SingupModalModule {}
