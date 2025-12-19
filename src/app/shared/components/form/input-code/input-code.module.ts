import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputCodeComponent } from './input-code.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [InputCodeComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [InputCodeComponent],
})
export class InputCodeModule {}
