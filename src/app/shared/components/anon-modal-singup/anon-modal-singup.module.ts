import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonModalSingupComponent } from './anon-modal-singup.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimaryButtonModule } from '../primary-button/primary-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnonModalSingupComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputModule,
    ReactiveFormsModule,
    PrimaryButtonModule,
    TranslateModule,
    DropdownModule,
  ],
  exports: [AnonModalSingupComponent],
})
export class AnonModalSingupModule {}
