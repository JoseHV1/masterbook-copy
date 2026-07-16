import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CDKModule } from 'src/core/cdk/cdk.module';
import { DateInputComponent } from './date-input.component';

@NgModule({
  declarations: [DateInputComponent],
  imports: [CommonModule, ReactiveFormsModule, CDKModule],
  exports: [DateInputComponent],
})
export class DateInputModule {}
