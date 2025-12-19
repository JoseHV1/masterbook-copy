import { Component, OnInit } from '@angular/core';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { finalize, take } from 'rxjs';
import { EmailService } from 'src/app/shared/services/email.service';
import { IntegrationsService } from 'src/app/shared/services/integration.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss'],
})
export class EmailListComponent implements OnInit {
  connected = false;
  data: any = [];
  loading = false;

  categorySelected: string = 'INBOX';
  searchQuery: string = '';
  recordsPerPage: number = 50;

  tokenHistory: string[] = this.initTokenPageArray();
  tokenHistoryPosition: number = 0;

  constructor(
    private _integrations: IntegrationsService,
    private _ui: UiService,
    private emailService: EmailService
  ) {}

  ngOnInit() {
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;

        if (!this.connected) {
          const returnTo = '/portal/communication';
          this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
            window.location.href = url;
          });
        } else {
          this._fetchData('initial');
        }
      },
      error: err => {
        console.error('status failed', err);
      },
    });
  }

  _fetchData(direction: 'next' | 'previous' | 'initial'): void {
    this._ui.showLoader();

    this.emailService
      .getEmailInbox(
        this.tokenHistory[this.tokenHistoryPosition],
        this.recordsPerPage,
        this.categorySelected,
        this.searchQuery
      )
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        this.data = resp.threads;

        switch (direction) {
          case 'initial':
            this.initialAction(resp.nextPageToken ?? 'end');
            break;
          case 'next':
            this.nextPageAction(resp.nextPageToken ?? 'end');
            break;
          case 'previous':
            break;
          default:
            break;
        }
      });
  }

  loadNextPage(): void {
    this.tokenHistoryPosition++;
    this._fetchData('next');
  }

  loadPreviousPage(): void {
    this.tokenHistoryPosition--;
    this._fetchData('previous');
  }

  canGoBack(): boolean {
    return this.tokenHistoryPosition > 0;
  }

  changeCategory(): void {
    this.resetHistory();
    this._fetchData('initial');
  }

  searchInbox(): void {
    this._fetchData('initial');
  }

  deleteMail(mail: string): void {
    this._ui
      .showConfirmationModal({
        text: `Are you sure you want to delete this mail?`,
        type: UiModalTypeEnum.ERROR,
      })
      .pipe(take(1))
      .subscribe((resp: boolean) => {
        if (resp) this.deleteEmailApi(mail);
      });
  }

  private deleteEmailApi(idMail: string): void {
    this._ui.showLoader();

    this.emailService.deleteEmail(idMail).subscribe({
      next: () => {
        this._ui.showAlertSuccess('The email has been successfully deleted.');
        this._fetchData('initial');
      },
      error: err => {
        console.error('Error al eliminar el correo:', err);
      },
    });
  }

  private initialAction(newToken: string): void {
    this.tokenHistory = [...this.tokenHistory, newToken];
  }

  private nextPageAction(newToken: string): void {
    if (this.tokenHistoryPosition === this.tokenHistory.length - 1) {
      this.tokenHistory = [...this.tokenHistory, newToken];
    }
  }

  private resetHistory(): void {
    this.tokenHistory = this.initTokenPageArray();
    this.tokenHistoryPosition = 0;
  }

  private initTokenPageArray(): string[] {
    return ['init'];
  }
}
