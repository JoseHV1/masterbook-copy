import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFormModalComponent } from './create-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CreateFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule, MatButtonModule, TranslateModule],
  exports: [CreateFormModalComponent],
})
export class CreateFormModalModule {}
