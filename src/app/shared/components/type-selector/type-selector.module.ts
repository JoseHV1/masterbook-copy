import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TypeSelectorComponent } from './type-selector.component';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TypeSelectorComponent],
  imports: [CommonModule, ButtonModule, SelectButtonModule, FormsModule],
  exports: [TypeSelectorComponent],
})
export class TypeSelectorModule {}
