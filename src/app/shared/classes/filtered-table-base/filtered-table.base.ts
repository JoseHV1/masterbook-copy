import { inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { skip } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { PaginatedResponse } from '../../interfaces/models/paginated-response.model';
import { FilterActive, FilterWrapperModel } from '../../models/filters.model';
import { AdminTenantContextService } from '../../services/admin-tenant-context.service';

export abstract class FilteredTable<T> {
  querySearch = '';
  timeout: any = null;
  filtersActive: FilterActive[] = [];

  private _filterText = '';
  private readonly _adminCtx = inject(AdminTenantContextService);
  private readonly _destroyRef = inject(DestroyRef);

  /**
   * filterText incluye automáticamente el filtro de tenant admin activo.
   * Los componentes lo leen y escriben como siempre — el tenant se concatena en el getter.
   */
  get filterText(): string {
    return this._filterText + this._adminCtx.filterParam;
  }

  protected set filterText(value: string) {
    this._filterText = value;
  }

  abstract filterConfig: FilterWrapperModel;
  abstract data: PaginatedResponse<T[]>;
  abstract _fetchData(page: number, hitsPerPage?: number): void;

  constructor() {
    // skip(1) para no re-fetchear en la carga inicial (el componente ya llama _fetchData en su constructor)
    this._adminCtx.tenant$
      .pipe(skip(1), takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        clearTimeout(this.timeout);
        this.querySearch = '';
        this.filtersActive = [];
        this.filterText = '';
        this._fetchData(0);
      });
  }

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
      if (valueText !== '' && valueText !== null && valueText !== undefined) {
        filterText = `${filterText}&${filter.name}=${valueText}`;
      }
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
    clearTimeout(this.timeout);
    if (this.filtersActive?.[index]?.name === 'search') {
      this.querySearch = '';
    } else if (!this.filtersActive?.some(f => f.name === 'search')) {
      // A search was being typed (debounce cancelled above) but never applied — discard it
      this.querySearch = '';
    }
    this.filtersActive?.splice(index, 1);
    this._applyFilter(this.filtersActive);
  }

  changePaginator($event: PageEvent): void {
    this._fetchData($event.pageIndex, $event.pageSize);
  }
}
