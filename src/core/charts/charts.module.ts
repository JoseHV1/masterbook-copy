import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxEchartsModule } from 'ngx-echarts';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';

import { KpiChartComponent } from './kpi-chart/kpi-chart.component';
import { RequestsByTypeChartComponent } from './rbt-donut-chart/requests-by-type-chart.component';
import { RequestsByTypePieChartComponent } from './rbt-pie-chart/requests-by-type-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { GroupedBarChartComponent } from './grouped-bar-chart/grouped-bar-chart.component';
import { AreaChartComponent } from './area-chart/area-chart.component';
import { QuotesStatusPieChartComponent } from './qbs-pie-chart/qbs-pie-chart.component';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { PolicyTimelineComponent } from './timeline/policy-timeline.component';
import { PaymentsChartComponent } from './dual-line-chart/dual-line-chart.component';
import { userCompareChartComponent } from './chart-9/user-compare.component';
import { StackedAreaChartComponent } from './stacked-area-chart/stacked-area-chart.component';

@NgModule({
  declarations: [
    KpiChartComponent,
    RequestsByTypeChartComponent,
    RequestsByTypePieChartComponent,
    BarChartComponent,
    GroupedBarChartComponent,
    AreaChartComponent,
    QuotesStatusPieChartComponent,
    StackedBarChartComponent,
    PolicyTimelineComponent,
    PaymentsChartComponent,
    userCompareChartComponent,
    StackedAreaChartComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,

    NgxEchartsModule,
  ],
  exports: [
    KpiChartComponent,
    RequestsByTypeChartComponent,
    RequestsByTypePieChartComponent,
    BarChartComponent,
    GroupedBarChartComponent,
    AreaChartComponent,
    QuotesStatusPieChartComponent,
    StackedBarChartComponent,
    PolicyTimelineComponent,
    PaymentsChartComponent,
    userCompareChartComponent,
    StackedAreaChartComponent,
  ],
})
export class ChartsModule {}
