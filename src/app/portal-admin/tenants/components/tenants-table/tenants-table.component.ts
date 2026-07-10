import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TenantModel } from 'src/app/shared/interfaces/models/tenant.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';
import { TenantStatusEnum } from 'src/app/shared/enums/tenant-status.enum';

@Component({
  selector: 'app-tenants-table',
  templateUrl: './tenants-table.component.html',
  styleUrls: ['./tenants-table.component.scss'],
})
export class TenantsTableComponent {
  @Input() data: TenantModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() refresh = new EventEmitter<void>();
  @Output() enableTenant = new EventEmitter<TenantModel>();
  @Output() disableTenant = new EventEmitter<TenantModel>();
  @Output() hardDeleteTenant = new EventEmitter<TenantModel>();

  readonly displayedColumns = [
    'serial',
    'name',
    'code',
    'currency',
    'status',
    'actions',
  ];

  readonly TenantStatusEnum = TenantStatusEnum;

  constructor(public url: UrlService) {}
}
