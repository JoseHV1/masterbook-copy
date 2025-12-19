import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterActive } from 'src/app/shared/models/filters.model';

@Component({
  selector: 'app-filtered-table-header',
  templateUrl: './filtered-table-header.component.html',
  styleUrls: ['./filtered-table-header.component.scss'],
})
export class FilteredTableHeaderComponent {
  @Input() filtersActive: FilterActive[] = [];
  @Input() onlySearch: boolean = false;
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() openFilters: EventEmitter<void> = new EventEmitter();
  @Output() removeChip: EventEmitter<number> = new EventEmitter();
  querySearch = '';

  get visibleChips(): FilterActive[] {
    return this.filtersActive.filter(c => c.text.toLowerCase() !== 'all');
  }

  onSearch(): void {
    this.search.emit(this.querySearch);
  }

  onOpenFilter(): void {
    this.openFilters.emit();
  }

  onRemoveChip(index: number): void {
    this.removeChip.emit(index);
  }
}
