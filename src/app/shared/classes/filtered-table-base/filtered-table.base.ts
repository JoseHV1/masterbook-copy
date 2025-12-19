import { PageEvent } from '@angular/material/paginator';
import { PaginatedResponse } from '../../interfaces/models/paginated-response.model';
import { FilterActive, FilterWrapperModel } from '../../models/filters.model';

export abstract class FilteredTable<T> {
  querySearch = '';
  timeout: any = null;
  filterText = '';
  filtersActive: FilterActive[] = [];

  abstract filterConfig: FilterWrapperModel;
  abstract data: PaginatedResponse<T[]>;
  abstract _fetchData(page: number, hitsPerPage?: number): void;

  handleApplyFilter(filters: Record<string, FilterActive | FilterActive[]>) {
    const flattened: FilterActive[] = Object.values(filters).flatMap(f =>
      Array.isArray(f) ? f : [f]
    );
    this._applyFilter(flattened);
  }

  _applyFilter(filters: FilterActive[]): void {
    if (this.querySearch.length) {
      const index = filters.findIndex(item => item.name === 'search');
      const searchFilter: FilterActive = {
        label: 'Search',
        name: 'search',
        text: this.querySearch,
        value: this.querySearch,
      };

      index >= 0
        ? (filters[index] = searchFilter)
        : filters.unshift(searchFilter);
    }
    this.filtersActive = filters;
    this._updateFilterText();
    this._fetchData(0);
  }

  _updateFilterText(): void {
    let filterText = '';
    this.filtersActive.forEach(filter => {
      const valueText = Array.isArray(filter.value)
        ? filter.value.join(',')
        : filter.value;
      filterText = `${filterText}&${filter.name}=${valueText}`;
    });
    this.filterText = filterText;
  }

  onQueryFilter(search?: string): void {
    this.querySearch = search ?? this.querySearch;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this._applyQueryFilter();
    }, 500);
  }

  private _applyQueryFilter(): void {
    if (!this.querySearch.length) {
      const filters: FilterActive[] = this.filtersActive.filter(
        item => item.name !== 'search'
      );
      this._applyFilter(filters);
      return;
    }

    this._applyFilter(this.filtersActive);
  }

  removeFilterFromChip(index: number): void {
    if (this.filtersActive && this.filtersActive[index]?.name === 'search') {
      this.querySearch = '';
    }

    this.filtersActive?.splice(index, 1);
    this._applyFilter(this.filtersActive);
  }

  changePaginator($event: PageEvent): void {
    this._fetchData($event.pageIndex, $event.pageSize);
  }
}
