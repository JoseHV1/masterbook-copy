import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';

import { ClaimsTableComponent } from './claims-table.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';

@NgModule({
  declarations: [ClaimsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatSlideToggleModule,
    FiltersModule,
  ],
  exports: [ClaimsTableComponent],
})
export class ClaimsTableModule {}
