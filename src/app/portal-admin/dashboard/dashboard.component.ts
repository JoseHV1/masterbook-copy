import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  metabaseUrl: any;

  constructor(private _dashboard: DashboardService) {}

  // ngOnInit() {
  //   this._dashboard.getDashboardUrl().subscribe(res => {
  //     this.metabaseUrl = res.data;
  //   });
  // }
}
