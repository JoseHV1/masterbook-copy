import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PagesLayoutButtonModel } from '../../models/pages-layout-button.model';
import { AuthService } from '../../services/auth.service';
import { PAYMENT_STATUS } from '../../enums/payment-status';
import { RolesEnum } from '../../enums/roles.enum';
import { PAYABLE_ITEMS } from '../../enums/payable-items.enum';
import { PaymetGatewayService } from '../../services/payment-gateway.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-pages-layout',
  templateUrl: './pages-layout.component.html',
  styleUrls: ['./pages-layout.component.scss'],
})
export class PagesLayoutComponent {
  @Input() button?: PagesLayoutButtonModel;
  @Input() showButtonInfo: boolean = false;
  @Input() filters: boolean = false;
  @Input() statistics: boolean = false;
  @Input() attachs: boolean = false;
  @Output() btnClick: EventEmitter<void> = new EventEmitter();
  @Output() btnInfoClick: EventEmitter<void> = new EventEmitter();

  isPaid = false;
  isOwner = false;
  isInsured = false;
  contactNumberBroker?: string;

  constructor(
    private _auth: AuthService,
    private _paymentGateway: PaymetGatewayService
  ) {
    const auth = this._auth.getAuth();
    const user = auth?.user;
    const userRole = user?.role as RolesEnum | undefined;
    const agency = user?.agency;

    // 🔹 For ADMIN, consider pages "paid"/unrestricted
    this.isPaid =
      userRole === RolesEnum.ADMIN ||
      agency?.payment_status === PAYMENT_STATUS.PAYED;

    // 🔹 Who can manage payments (owner / independent broker)
    this.isOwner =
      userRole === RolesEnum.AGENCY_OWNER ||
      userRole === RolesEnum.INDEPENDANT_BROKER;

    // 🔹 Insured flag
    this.isInsured = userRole === RolesEnum.INSURED;
    if (this.isInsured) {
      this.contactNumberBroker = user?.broker?.contact_number;
    }
  }

  goToPaymentIntent(): void {
    // only owners / independent brokers can pay
    if (!this.isOwner) return;

    const userRole = this._auth.getAuth()?.user.role as RolesEnum | undefined;
    if (!userRole) return;

    const payableItem =
      userRole === RolesEnum.AGENCY_OWNER
        ? PAYABLE_ITEMS.AGENCY_MEMBERSHIP
        : PAYABLE_ITEMS.INDEPENDENT_AGENT;

    this._paymentGateway
      .createPaymentSessionId({ pay_item: payableItem })
      .pipe(tap(resp => (window.location.href = resp)))
      .subscribe();
  }
}
