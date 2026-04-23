import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminLeadsTableComponent } from './admin-leads-table.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

@NgModule({
  declarations: [AdminLeadsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatTooltipModule,
    CustomPipesModule,
    FiltersModule,
  ],
  exports: [AdminLeadsTableComponent],
})
export class AdminLeadsTableModule {}
