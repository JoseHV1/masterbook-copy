import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatisticsCardComponent } from './dashboard-statistics-card.component';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

@NgModule({
  declarations: [DashboardStatisticsCardComponent],
  imports: [CommonModule, CustomPipesModule],
  exports: [DashboardStatisticsCardComponent],
})
export class DashboardStatisticsCardModule {}
