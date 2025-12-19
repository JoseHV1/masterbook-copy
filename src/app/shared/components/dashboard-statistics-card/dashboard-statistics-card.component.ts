import { Component, Input } from '@angular/core';
import { StatisticsCardModel } from './dashboard-statistics-card-models';

@Component({
  selector: 'app-dashboard-statistics-card',
  templateUrl: './dashboard-statistics-card.component.html',
  styleUrls: ['./dashboard-statistics-card.component.scss'],
})
export class DashboardStatisticsCardComponent {
  @Input() item!: StatisticsCardModel;
}
