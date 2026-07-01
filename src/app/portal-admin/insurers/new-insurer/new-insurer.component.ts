import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { AdminInsurersService } from 'src/app/shared/services/admin-insurers.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { CreateInsurerRequest } from 'src/app/shared/interfaces/models/insurer.model';

@Component({
  selector: 'app-new-insurer',
  templateUrl: './new-insurer.component.html',
  styleUrls: ['./new-insurer.component.scss'],
})
export class NewInsurerComponent implements OnInit {
  constructor(
    private readonly _insurers: AdminInsurersService,
    private readonly _ui: UiService,
    private readonly _router: Router,
    private readonly _t: TranslateService,
    private readonly _tenants: TenantsService,
  ) {}

  ngOnInit(): void {
    this._tenants.getAll(0, 1).pipe(take(1)).subscribe({ next: resp => {
      if (resp.total_records === 0) {
        this._ui.showAlertWarning(this._t.instant('PORTAL.TENANTS.REQUIRED_BEFORE_ACTION'));
        this._router.navigateByUrl('portal-admin/tenants/list');
      }
    }});
  }

  create(req: CreateInsurerRequest): void {
    this._ui.showLoader();
    this._insurers
      .create(req)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: () => {
          this._ui.showAlertSuccess(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.SUCCESS_CREATED'));
          this._router.navigateByUrl('portal-admin/insurers/list');
        },
        error: () => this._ui.showAlertError(this._t.instant('PORTAL.PORTAL_ADMIN.INSURERS.ERROR_CREATE')),
      });
  }

  cancel(): void {
    this._router.navigateByUrl('portal-admin/insurers/list');
  }
}
