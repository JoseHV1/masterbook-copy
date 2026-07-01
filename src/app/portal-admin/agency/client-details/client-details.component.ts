import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPanelService } from '@app/shared/services/admin-panel.service';
import { finalize, switchMap, take, tap } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-accounts-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
})
export class ClientDetailsComponent {
  agency!: any;
  auditLog: any[] = [];
  changingBillingMode = false;

  constructor(
    private activateRoute: ActivatedRoute,
    public _url: UrlService,
    private _ui: UiService,
    private _router: Router,
    private _location: Location,
    private _adminPanel: AdminPanelService
  ) {
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._loadAgencyDetails(id);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal-admin/agencies'),
      });
  }

  private _loadAgencyDetails(serial: string) {
    return this._adminPanel.getClient(serial).pipe(
      tap(resp => {
        this.agency = resp;
        if (resp?._id) this._fetchAuditLog(resp._id);
      })
    );
  }

  private _fetchAuditLog(agencyId: string): void {
    this._adminPanel.getAuditLog(agencyId).subscribe({
      next: log => (this.auditLog = log ?? []),
    });
  }

  changeBillingMode(newMode: string): void {
    if (!newMode || newMode === this.agency?.billing_mode) return;
    const msg =
      newMode === 'FREE'
        ? '¿Confirmar cambio a modo FREE? Se pausará la suscripción de Stripe si existe.'
        : '¿Confirmar cambio a modo STRIPE? El dueño recibirá un correo y deberá completar el proceso de pago.';
    if (!confirm(msg)) return;

    this.changingBillingMode = true;
    this._ui.showLoader();
    this._adminPanel
      .changeBillingMode(this.agency._id, newMode)
      .pipe(finalize(() => { this._ui.hideLoader(); this.changingBillingMode = false; }))
      .subscribe({
        next: () => {
          this.agency = { ...this.agency, billing_mode: newMode };
          this._fetchAuditLog(this.agency._id);
        },
      });
  }

  goBack(): void {
    this._location.back();
  }
}
