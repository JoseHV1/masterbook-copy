import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalChangeLogsComponent } from './modal-change-logs.component';
import { MatTableModule } from '@angular/material/table';
import { FiltersModule } from '../filters/filters.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ModalChangeLogsComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatDialogModule,
    FiltersModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [ModalChangeLogsComponent],
})
export class ModalChangeLogsModule {}
