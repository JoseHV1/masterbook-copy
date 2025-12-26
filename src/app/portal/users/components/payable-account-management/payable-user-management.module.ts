import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayableUserManagementComponent } from './payable-user-management.component';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // <-- Importación agregada

@NgModule({
  declarations: [PayableUserManagementComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [PayableUserManagementComponent],
})
export class PayableAccountManagementModule {}
