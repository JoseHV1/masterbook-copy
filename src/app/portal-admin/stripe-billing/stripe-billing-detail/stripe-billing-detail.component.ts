import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { finalize } from 'rxjs';
import { StripeBillingModel } from 'src/app/shared/interfaces/models/stripe-billing.model';
import { StripeBillingService } from 'src/app/shared/services/stripe-billing.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { StripeBillingStatusEnum } from 'src/app/shared/enums/stripe-billing-status.enum';

@Component({
  selector: 'app-stripe-billing-detail',
  templateUrl: './stripe-billing-detail.component.html',
  styleUrls: ['./stripe-billing-detail.component.scss'],
})
export class StripeBillingDetailComponent implements OnInit {
  record: StripeBillingModel | null = null;
  readonly StripeBillingStatusEnum = StripeBillingStatusEnum;

  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _billing: StripeBillingService,
    private readonly _ui: UiService,
    private readonly _location: Location,
  ) {}

  ngOnInit(): void {
    const serial = this._route.snapshot.paramMap.get('serial');
    if (serial) this._load(serial);
  }

  goBack(): void {
    this._location.back();
  }

  formatAmount(amount: number, currency: string): string {
    return `${(amount / 100).toFixed(2)} ${currency.toUpperCase()}`;
  }

  private _load(serial: string): void {
    this._ui.showLoader();
    this._billing
      .getOne(serial)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: record => (this.record = record),
        error: () => this._ui.showAlertError('Error loading billing record'),
      });
  }
}
