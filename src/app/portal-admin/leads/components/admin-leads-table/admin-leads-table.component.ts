import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { LeadModel } from 'src/app/portal/leads/interfaces/lead.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-admin-leads-table',
  templateUrl: './admin-leads-table.component.html',
  styleUrls: ['./admin-leads-table.component.scss'],
})
export class AdminLeadsTableComponent {
  @Input() data: LeadModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Input() showActions = false;
  @Input() detailBasePath = '';
  @Output() refresh = new EventEmitter<void>();
  @Output() transferLead = new EventEmitter<LeadModel>();

  constructor(public url: UrlService) {}

  private readonly baseColumns: string[] = [
    'serial',
    'name',
    'email',
    'phone_number',
    'capture_medium',
    'status',
    'created_at',
  ];

  get displayedColumns(): string[] {
    return this.showActions ? [...this.baseColumns, 'actions'] : this.baseColumns;
  }
}
