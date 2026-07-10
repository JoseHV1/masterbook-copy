import { Component, Input, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { finalize } from 'rxjs';
import { PaginatedResponse } from 'src/app/shared/interfaces/models/paginated-response.model';
import { FilterActive, FilterWrapperModel } from 'src/app/shared/models/filters.model';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { HowToService } from '@app/shared/services/how-to.service';
import { TenantModel } from '@app/shared/interfaces/models/tenant.model';

@Component({
  selector: 'app-how-to-tenant-section',
  templateUrl: './how-to-tenant-section.component.html',
  styleUrls: ['./how-to-tenant-section.component.scss'],
})
export class HowToTenantSectionComponent implements OnInit {
  @Input() tenant!: TenantModel;

  data: PaginatedResponse<HowToModel[]> = {
    records: [],
    page: 1,
    limit: 10,
    total_records: 0,
  };

  loading = false;
  filterConfig: FilterWrapperModel;
  filtersActive: FilterActive[] = [];

  private _search = '';
  private _filterText = '';

  constructor(private _howTo: HowToService) {
    this.filterConfig = this._howTo.getHowToFilters();
  }

  ngOnInit(): void {
    this._loadData(0);
  }

  onSearch(search: string): void {
    this._search = search;
    this._loadData(0);
  }

  onPageChange(event: PageEvent): void {
    this._loadData(event.pageIndex, event.pageSize);
  }

  handleApplyFilter(filters: Record<string, FilterActive | FilterActive[]>): void {
    const flattened: FilterActive[] = Object.values(filters).flatMap(f => (Array.isArray(f) ? f : [f]));
    this._applyFilters(flattened);
  }

  removeFilterFromChip(index: number): void {
    const filters = [...this.filtersActive];
    filters.splice(index, 1);
    this._applyFilters(filters);
  }

  refresh(): void {
    this._loadData(this.data.page - 1, this.data.limit);
  }

  private _applyFilters(filters: FilterActive[]): void {
    this.filtersActive = filters;
    this._filterText = filters
      .filter(f => f.value !== '' && f.value !== null && f.value !== undefined)
      .map(f => `&${f.name}=${Array.isArray(f.value) ? f.value.join(',') : f.value}`)
      .join('');
    this._loadData(0);
  }

  private _loadData(page: number, limit?: number): void {
    const hits = limit ?? this.data.limit;
    const filters =
      `&tenant_id=${this.tenant._id}` +
      (this._search ? `&search=${encodeURIComponent(this._search)}` : '') +
      this._filterText;
    this.loading = true;
    this._howTo
      .getHowToList(page, hits, filters)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe(resp => (this.data = resp));
  }
}
