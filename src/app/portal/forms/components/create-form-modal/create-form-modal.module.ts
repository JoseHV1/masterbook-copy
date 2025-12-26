import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateFormModalComponent } from './create-form-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CDKModule } from 'src/core/cdk/cdk.module';

@NgModule({
  declarations: [CreateFormModalComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule, MatButtonModule],
  exports: [CreateFormModalComponent],
})
export class CreateFormModalModule {}
