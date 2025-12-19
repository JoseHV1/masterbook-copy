import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea.component';
import { InputTextareaModule } from 'primeng/inputtextarea';

@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, FormsModule, InputTextareaModule],
  exports: [TextareaComponent],
})
export class TextareaModule {}
