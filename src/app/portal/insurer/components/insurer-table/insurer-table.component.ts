import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InsurerModel } from 'src/app/shared/interfaces/models/insurer.model';
import { FilterActive } from 'src/app/shared/models/filters.model';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-insurer-table',
  templateUrl: './insurer-table.component.html',
  styleUrls: ['./insurer-table.component.scss'],
})
export class InsurerTableComponent {
  @Output() refresh: EventEmitter<void> = new EventEmitter();

  @Input() data?: InsurerModel[];
  @Input() filtersActive: FilterActive[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'country',
    'ein',
    'email',
    'phone',
    'fax',
    'status',
    'created_at',
  ];

  constructor(public _url: UrlService) {}
}
