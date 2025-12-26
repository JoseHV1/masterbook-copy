import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PictureSelectorComponent } from './picture-selector.component';

@NgModule({
  declarations: [PictureSelectorComponent],
  imports: [CommonModule, FormsModule],
  exports: [PictureSelectorComponent],
})
export class PictureSelectorModule {}
