import { Component } from '@angular/core';
import { STATISTICS_CARD } from './statistics-card-information';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  STATISTICS_CARD = STATISTICS_CARD;
}
