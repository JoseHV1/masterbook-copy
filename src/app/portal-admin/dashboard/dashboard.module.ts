import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardStatisticsCardModule } from 'src/app/shared/components/dashboard-statistics-card/dashboard-statistics-card.module';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { CustomPipesModule } from 'src/app/shared/pipes/custom-pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DashboardStatisticsCardModule,
    PagesLayoutModule,
    CustomPipesModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
