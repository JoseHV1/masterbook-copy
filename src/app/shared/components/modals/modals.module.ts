import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { InformationModalComponent } from './information-modal/information-modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ConfirmationModalComponent, InformationModalComponent],
  imports: [CommonModule, DialogModule, ButtonModule, RouterModule],
  exports: [ConfirmationModalComponent, InformationModalComponent],
})
export class ModalsModule {}
