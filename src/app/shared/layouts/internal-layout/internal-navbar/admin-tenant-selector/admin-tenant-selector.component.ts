import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { AdminTenantContextService } from 'src/app/shared/services/admin-tenant-context.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-admin-tenant-selector',
  templateUrl: './admin-tenant-selector.component.html',
  styleUrls: ['./admin-tenant-selector.component.scss'],
})
export class AdminTenantSelectorComponent implements OnInit, OnDestroy {
  tenants: TenantModel[] = [];
  selected: TenantModel | null = null;
  private _destroy$ = new Subject<void>();

  constructor(
    private readonly _tenants: TenantsService,
    private readonly _ctx: AdminTenantContextService,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this._ctx.tenant$
      .pipe(takeUntil(this._destroy$))
      .subscribe(t => (this.selected = t));

    this._fetchTenants();

    this._router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        switchMap(() => this._tenants.getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)),
        takeUntil(this._destroy$),
      )
      .subscribe({ next: resp => this._setTenants(resp.records) });
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _fetchTenants(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe({ next: resp => this._setTenants(resp.records) });
  }

  private _setTenants(records: TenantModel[]): void {
    this.tenants = records.sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
  }

  select(tenant: TenantModel | null, panel: any): void {
    this._ctx.setTenant(tenant);
    panel.hide();
  }

  get isFiltered(): boolean {
    return this.selected !== null;
  }
}
