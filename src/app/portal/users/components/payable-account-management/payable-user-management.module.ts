import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayableUserManagementComponent } from './payable-user-management.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PayableUserManagementComponent],
  imports: [CommonModule, MatProgressBarModule, MatTooltipModule, TranslateModule],
  exports: [PayableUserManagementComponent],
})
export class PayableAccountManagementModule {}
