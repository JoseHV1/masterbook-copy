import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IntegrationsService } from 'src/app/shared/services/integration.service';
import { UrlService } from 'src/app/shared/services/url.service';

@Component({
  selector: 'app-email-table',
  templateUrl: './email-table.component.html',
  styleUrls: ['./email-table.component.scss'],
})
export class EmailTableComponent {
  @Input() data?: any[];
  @Output() deleteEmailEmitter = new EventEmitter<string>();

  displayedColumns: string[] = ['user', 'content', 'time', 'action'];

  constructor(private url: UrlService) {}

  goToEmailDetail(id: string): void {
    this.url.navigateTo('portal/email/detail', id);
  }

  deleteEmail(mail: any): void {
    this.deleteEmailEmitter.emit(mail.id);
  }

  onRowClick(event: MouseEvent, row: any): void {
    const clickedInAction = (event.target as HTMLElement).closest(
      '.action-cell'
    );
    if (clickedInAction) {
      return;
    }
    this.goToEmailDetail(row.id);
  }
}
