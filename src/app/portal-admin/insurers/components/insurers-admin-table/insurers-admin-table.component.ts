import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-insurers-admin-table',
  templateUrl: './insurers-admin-table.component.html',
  styleUrls: ['./insurers-admin-table.component.scss'],
})
export class InsurersAdminTableComponent {
  @Input() data: InsurerModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() refresh = new EventEmitter<void>();
  @Output() deleteInsurer = new EventEmitter<InsurerModel>();
  @Output() tenantStatus = new EventEmitter<InsurerModel>();

  readonly displayedColumns = ['serial', 'name', 'country', 'tenants', 'status', 'actions'];

  constructor(public url: UrlService) {}
}
