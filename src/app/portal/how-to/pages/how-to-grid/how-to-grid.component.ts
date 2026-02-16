import { Component, OnInit } from '@angular/core';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { Router } from '@angular/router';
import { getVideoId } from '@app/shared/helpers/get-video-id';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { PaginatedResponse } from '@app/shared/interfaces/models/paginated-response.model';
import { HowToService } from '@app/shared/services/how-to.service';
import { UiService } from '@app/shared/services/ui.service';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-how-to-grid',
  templateUrl: './how-to-grid.component.html',
  styleUrls: ['./how-to-grid.component.scss'],
})
export class HowToGridComponent implements OnInit {
  selectedVideo: HowToModel | null = null;
  selectedIndex: number = -1;
  description!: SafeHtml;
  data: PaginatedResponse<HowToModel[]> = {
    records: [],
    page: 0,
    limit: 1000,
    total_records: 0,
  };
  filterdResults: HowToModel[] = [];
  safeUrlVideo: SafeResourceUrl | null = null;
  isShort: boolean = false;
  query = '';

  constructor(
    private readonly _howToService: HowToService,
    private readonly _ui: UiService,
    private readonly _sanitizer: DomSanitizer,
    private readonly _router: Router,
    public file: UploadFileService
  ) {}

  ngOnInit() {
    this._fetchData(this.data.page, this.data.limit);
  }

  _fetchData(page: number, limit?: number) {
    const hits = limit ?? this.data.limit;
    this._ui.showLoader();
    this._howToService
      .getHowToList(page, hits)
      .pipe(
        tap(resp => {
          if (resp.records && Array.isArray(resp.records)) {
            resp.records.forEach((item: any) => {
              item.description = this._sanitizer.bypassSecurityTrustHtml(
                item.description ?? ''
              );
            });
          }
          this.data = resp;
          this.filterHowTo();
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe();
  }

  filterHowTo(): void {
    this.filterdResults = this.data.records.filter(item =>
      item.title.toLowerCase().includes(this.query.toLowerCase())
    );
    if (this.filterdResults[0]) {
      this.selectVideo(this.filterdResults[0]);
      this.selectedIndex = 0;
      return;
    }
    this.selectedIndex = -1;
  }

  selectVideo(video: HowToModel) {
    this.selectedVideo = video;

    if (this.selectedVideo) {
      this.processVideoUrl(this.selectedVideo.video);
    }
  }

  processVideoUrl(url: string) {
    if (!url) return;

    this.isShort = url.includes('/shorts/');

    const videoId = getVideoId(url);

    if (!videoId) {
      this.safeUrlVideo = null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0autoplay=1`;
    this.safeUrlVideo =
      this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
