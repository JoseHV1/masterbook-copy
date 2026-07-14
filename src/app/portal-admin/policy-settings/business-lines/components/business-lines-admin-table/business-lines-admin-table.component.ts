import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BusinessLineModel } from 'src/app/shared/interfaces/models/business-line.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-business-lines-admin-table',
  templateUrl: './business-lines-admin-table.component.html',
  styleUrls: ['./business-lines-admin-table.component.scss'],
})
export class BusinessLinesAdminTableComponent {
  @Input() data: BusinessLineModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() deleteBusinessLine = new EventEmitter<BusinessLineModel>();
  @Output() tenantStatus = new EventEmitter<BusinessLineModel>();

  readonly displayedColumns = ['name', 'tenants', 'created_at', 'actions'];

  constructor(public url: UrlService) {}
}
