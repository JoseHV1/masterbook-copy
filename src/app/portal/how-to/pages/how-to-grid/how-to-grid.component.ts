import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { getVideoId } from '@app/shared/helpers/get-video-id';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { PaginatedResponse } from '@app/shared/interfaces/models/paginated-response.model';
import { HowToService } from '@app/shared/services/how-to.service';
import { UiService } from '@app/shared/services/ui.service';
import { Subject, finalize, takeUntil } from 'rxjs';

const PAGE_SIZE = 12;

@Component({
  selector: 'app-how-to-grid',
  templateUrl: './how-to-grid.component.html',
  styleUrls: ['./how-to-grid.component.scss'],
})
export class HowToGridComponent implements OnInit, OnDestroy {
  private _destroy$ = new Subject<void>();

  data: PaginatedResponse<HowToModel[]> = {
    records: [],
    page: 0,
    limit: 1000,
    total_records: 0,
  };
  filteredResults: HowToModel[] = [];
  pagedResults: HowToModel[] = [];
  query = '';
  pageIndex = 0;
  readonly pageSize = PAGE_SIZE;

  constructor(
    private readonly _howToService: HowToService,
    private readonly _ui: UiService,
  ) {}

  ngOnInit(): void {
    this._fetchData();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _fetchData(): void {
    this._ui.showLoader();
    this._howToService
      .getHowToList(0, this.data.limit)
      .pipe(finalize(() => this._ui.hideLoader()), takeUntil(this._destroy$))
      .subscribe(resp => {
        this.data = resp;
        this.filterHowTo();
      });
  }

  filterHowTo(): void {
    const q = this.query.trim().toLowerCase();
    this.filteredResults = q
      ? this.data.records.filter(item => item.title.toLowerCase().includes(q))
      : this.data.records;
    this.pageIndex = 0;
    this._updatePage();
  }

  changePage(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this._updatePage();
  }

  private _updatePage(): void {
    const start = this.pageIndex * this.pageSize;
    this.pagedResults = this.filteredResults.slice(start, start + this.pageSize);
  }

  thumbnailFor(video: HowToModel): string {
    const videoId = getVideoId(video.video);
    return videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : 'assets/images/empty/default-empty.svg';
  }

  openVideo(video: HowToModel): void {
    window.open(video.video, '_blank', 'noopener');
  }
}
