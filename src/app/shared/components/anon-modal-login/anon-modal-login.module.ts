import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonModalLoginComponent } from './anon-modal-login.component';
import { DialogModule } from 'primeng/dialog';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PrimaryButtonModule } from '../primary-button/primary-button.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnonModalLoginComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputModule,
    ReactiveFormsModule,
    PrimaryButtonModule,
    TranslateModule,
  ],
  exports: [AnonModalLoginComponent],
})
export class AnonModalLoginModule {}
