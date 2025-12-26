import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilteredTableHeaderComponent } from './filtered-table-header.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [FilteredTableHeaderComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
  ],
  exports: [FilteredTableHeaderComponent],
})
export class FilteredTableHeaderModule {}
