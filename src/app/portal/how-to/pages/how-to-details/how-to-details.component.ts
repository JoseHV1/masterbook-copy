import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, switchMap, take, tap } from 'rxjs';
import { UiService } from 'src/app/shared/services/ui.service';
import { HowToService } from '@app/shared/services/how-to.service';
import { HowToModel } from '@app/shared/interfaces/models/how-to.model';
import { UrlService } from '@app/shared/services/url.service';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { UploadFileService } from '@app/shared/services/upload_file.service';
import {
  DomSanitizer,
  SafeHtml,
  SafeResourceUrl,
} from '@angular/platform-browser';
import { getVideoId } from '@app/shared/helpers/get-video-id';

@Component({
  selector: 'app-how-to-details',
  templateUrl: './how-to-details.component.html',
  styleUrls: ['./how-to-details.component.scss'],
})
export class HowToDetailComponent {
  howTo!: HowToModel;
  video: SafeResourceUrl | null = null;
  description!: SafeHtml;
  isShort: boolean = false;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private _location: Location,
    private _howTo: HowToService,
    private _router: Router,
    public _url: UrlService,
    public file: UploadFileService,
    private _sanitizer: DomSanitizer
  ) {
    this._ui.showLoader();
    this.activateRoute.params
      .pipe(
        take(1),
        switchMap(params => {
          const id = params['id'];
          if (!id) throw new Error();
          return this._howTo.getHowToBySerial(id);
        }),
        tap(howTo => {
          this.howTo = howTo;
          this.description = this._sanitizer.bypassSecurityTrustHtml(
            howTo.description ?? ''
          );
          this.processVideoUrl(howTo.video);
        }),
        finalize(() => this._ui.hideLoader())
      )
      .subscribe({
        error: () => this._router.navigateByUrl('portal-admin/how-to'),
      });
  }

  goBack(): void {
    this._location.back();
  }

  deleteHowTo(_id: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this video?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this._executeDelete(_id);
      });
  }

  private _executeDelete(_id: string): void {
    this._ui.showLoader();
    this._howTo
      .deleteHowTo(_id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(() => {
        this._ui.showAlertSuccess('video deleted successfully');
        this._router.navigateByUrl('portal-admin/how-to');
      });
  }

  processVideoUrl(url: string) {
    if (!url) return;

    this.isShort = url.includes('/shorts/');

    const videoId = getVideoId(url);

    if (!videoId) {
      this.video = null;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0autoplay=1`;
    this.video = this._sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }
}
