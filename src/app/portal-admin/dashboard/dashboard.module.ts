import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardStatisticsCardModule } from 'src/app/shared/components/dashboard-statistics-card/dashboard-statistics-card.module';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';
import { SummaryCardsModule } from './components/summary-cards/summary-cards.module';
import { MatCard, MatCardModule } from '@angular/material/card';
import { KpiChartComponent } from 'src/core/charts/kpi-chart/kpi-chart.component';
import { ChartsModule } from 'src/core/charts/charts.module';
import { MatDivider, MatDividerModule } from '@angular/material/divider';
import { ChartsFiltersModule } from '@app/portal/activities/components/chart-filters/chart-filters.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    DashboardStatisticsCardModule,
    PagesLayoutModule,
    CustomPipesModule,
    SummaryCardsModule,
    MatCardModule,
    ChartsModule,
    MatDividerModule,
    ChartsFiltersModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
