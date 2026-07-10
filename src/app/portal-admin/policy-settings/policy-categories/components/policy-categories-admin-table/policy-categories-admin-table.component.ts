import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PolicyCategoryModel } from 'src/app/shared/interfaces/models/policy-category.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-policy-categories-admin-table',
  templateUrl: './policy-categories-admin-table.component.html',
  styleUrls: ['./policy-categories-admin-table.component.scss'],
})
export class PolicyCategoriesAdminTableComponent {
  @Input() data: PolicyCategoryModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() deleteCategory = new EventEmitter<PolicyCategoryModel>();
  @Output() tenantStatus = new EventEmitter<PolicyCategoryModel>();

  readonly displayedColumns = ['name', 'business_lines', 'tenants', 'actions'];

  constructor(public url: UrlService) {}
}
