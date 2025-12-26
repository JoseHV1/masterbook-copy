import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequesTypeSelectorComponent } from './request-type-selector.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [RequesTypeSelectorComponent],
  imports: [
    CommonModule,
    SelectButtonModule,
    FormsModule,
    MatButtonToggleModule,
  ],
  exports: [RequesTypeSelectorComponent],
})
export class RequesTypeSelectorModule {}
