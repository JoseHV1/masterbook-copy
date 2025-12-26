import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { DashboardStatisticsCardModule } from 'src/app/shared/components/dashboard-statistics-card/dashboard-statistics-card.module';

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
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
