import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsTableComponent } from './leads-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

@NgModule({
  declarations: [LeadsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    FiltersModule,
  ],
  exports: [LeadsTableComponent],
})
export class LeadsTableModule {}
