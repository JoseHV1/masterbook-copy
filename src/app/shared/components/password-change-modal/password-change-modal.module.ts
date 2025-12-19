import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordChangeModalComponent } from './password-change-modal.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PasswordChangeModalComponent],
  imports: [CommonModule, TranslateModule],
  exports: [PasswordChangeModalComponent],
})
export class PasswordChangeModalModule {}
