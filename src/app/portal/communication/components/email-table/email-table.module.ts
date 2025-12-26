import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailTableComponent } from './email-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { GmailDateFormatPipe } from '../../pipe/gmail-date-format.pipe';

@NgModule({
  declarations: [EmailTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    FiltersModule,
    GmailDateFormatPipe,
  ],
  exports: [EmailTableComponent],
})
export class EmailTableModule {}
