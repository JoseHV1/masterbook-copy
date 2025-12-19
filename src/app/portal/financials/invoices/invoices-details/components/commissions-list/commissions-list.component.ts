import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-commissions-list',
  templateUrl: './commissions-list.component.html',
  styleUrls: ['./commissions-list.component.scss'],
})
export class CommissionsListComponent {
  @Input() data: any[] = [];

  displayedColumns: string[] = [
    'id',
    'agent',
    'amount',
    'policy_number',
    'policy_type',
  ];

  constructor(public _url: UrlService, private router: Router) {}

  navigateTo(url: string) {
    this.router.navigateByUrl(`portal/requests/${url}`);
  }
}
