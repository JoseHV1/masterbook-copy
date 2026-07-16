import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class CustomPaginatorIntl extends MatPaginatorIntl {
  constructor(private _translate: TranslateService) {
    super();
    this._translate.onLangChange.subscribe(() => this._updateLabels());
    this._updateLabels();
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this._translate.instant('PORTAL.PAGINATOR.OF')} ${length}`;
    }
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${startIndex + 1} – ${endIndex} ${this._translate.instant(
      'PORTAL.PAGINATOR.OF'
    )} ${length}`;
  };

  private _updateLabels(): void {
    this.itemsPerPageLabel = this._translate.instant(
      'PORTAL.PAGINATOR.ITEMS_PER_PAGE'
    );
    this.nextPageLabel = this._translate.instant('PORTAL.PAGINATOR.NEXT_PAGE');
    this.previousPageLabel = this._translate.instant(
      'PORTAL.PAGINATOR.PREVIOUS_PAGE'
    );
    this.firstPageLabel = this._translate.instant(
      'PORTAL.PAGINATOR.FIRST_PAGE'
    );
    this.lastPageLabel = this._translate.instant('PORTAL.PAGINATOR.LAST_PAGE');
    this.changes.next();
  }
}
