import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TenantModel } from '@app/shared/interfaces/models/tenant.model';
import { TenantsService } from 'src/app/shared/services/tenants.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';
import { AdminTenantContextService } from 'src/app/shared/services/admin-tenant-context.service';

@Component({
  selector: 'app-how-to-list',
  templateUrl: './how-to-list.component.html',
  styleUrls: ['./how-to-list.component.scss'],
})
export class HowToListComponent implements OnInit, OnDestroy {
  tenants: TenantModel[] = [];
  private _allTenants: TenantModel[] = [];
  private _destroy$ = new Subject<void>();

  constructor(
    private _tenants: TenantsService,
    private _ctx: AdminTenantContextService,
  ) {}

  ngOnInit(): void {
    this._tenants
      .getAll(0, 100, `&status=${TenantStatusEnum.ACTIVE}`)
      .pipe(takeUntil(this._destroy$))
      .subscribe(resp => {
        this._allTenants = resp.records;
        this._applyContextFilter(this._ctx.snapshot);
      });

    this._ctx.tenant$
      .pipe(takeUntil(this._destroy$))
      .subscribe(selected => this._applyContextFilter(selected));
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _applyContextFilter(selected: TenantModel | null): void {
    this.tenants = selected
      ? this._allTenants.filter(t => t._id === selected._id)
      : this._allTenants;
  }
}
