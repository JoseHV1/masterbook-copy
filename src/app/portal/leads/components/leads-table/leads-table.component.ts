import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { LeadModel } from '../../interfaces/lead.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-leads-table',
  templateUrl: './leads-table.component.html',
  styleUrls: ['./leads-table.component.scss'],
})
export class LeadsTableComponent {
  @Input() data: LeadModel[] = [];
  @Input() filtersActive: FilterActive[] = [];
  @Output() refresh = new EventEmitter<void>();

  constructor(public url: UrlService) {}

  displayedColumns: string[] = [
    'serial',
    'name',
    'email',
    'phone_number',
    'gender',
    'capture_medium',
    'areas_of_interest',
    'status',
    'created_at',
  ];
}
