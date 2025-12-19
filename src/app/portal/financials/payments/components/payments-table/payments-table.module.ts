import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsTableComponent } from './payments-table.component';
import { MatTableModule } from '@angular/material/table';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [PaymentsTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    CustomPipesModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    FiltersModule,
  ],
  exports: [PaymentsTableComponent],
})
export class PaymentsTableModule {}
