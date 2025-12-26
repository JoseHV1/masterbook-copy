import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopulatedPaymentModel } from 'src/app/shared/models/payments.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
})
export class PaymentsListComponent implements OnInit {
  @Input() data: PopulatedPaymentModel[] = [];
  @Input() parent!: string;

  displayedColumns: string[] = [];

  constructor(public _url: UrlService, private router: Router) {}

  ngOnInit(): void {
    this.displayedColumns = [
      'id',
      'payment_date',
      'payment_applied',
      'policy_number',
      'ach_number',
    ];

    if (this.parent === 'payment-details') {
      this.displayedColumns.push('insurance_company', 'invoice');
    } else {
      this.displayedColumns.push('actions');
    }
  }

  navigateTo(url: string) {
    this.router.navigateByUrl(`portal/requests/${url}`);
  }

  goCreatePayment(id: string) {
    this.router.navigateByUrl(`portal/payments/new?payment_id=${id}`);
  }
}
