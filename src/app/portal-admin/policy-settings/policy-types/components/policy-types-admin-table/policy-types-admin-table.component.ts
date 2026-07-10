import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PolicyTypeModel } from 'src/app/shared/interfaces/models/policy-type.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-policy-types-admin-table',
  templateUrl: './policy-types-admin-table.component.html',
  styleUrls: ['./policy-types-admin-table.component.scss'],
})
export class PolicyTypesAdminTableComponent {
  @Input() data: PolicyTypeModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() deletePolicyType = new EventEmitter<PolicyTypeModel>();
  @Output() tenantStatus = new EventEmitter<PolicyTypeModel>();

  readonly displayedColumns = ['name', 'naic_code', 'type', 'tenants', 'actions'];

  constructor(public url: UrlService) {}
}
