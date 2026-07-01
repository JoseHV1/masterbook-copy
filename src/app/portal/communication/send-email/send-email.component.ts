import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { finalize } from 'rxjs';
import {
  Attachment,
  EmailPayload,
  EmailService,
} from 'src/app/shared/services/email.service';
import { UiService } from 'src/app/shared/services/ui.service';
import { AuthService } from '@app/shared/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent implements OnInit {
  loading: boolean = false;
  message: string = '';

  emailData: EmailPayload = {
    to: '',
    subject: '',
    body: '',
    attachments: [],
  };

  constructor(
    private emailService: EmailService,
    private uiService: UiService,
    private _location: Location,
    private _route: ActivatedRoute,
    private _auth: AuthService,
    private _t: TranslateService,
  ) {}

  ngOnInit(): void {
    const to = this._route.snapshot.queryParamMap.get('to');
    if (to && to !== this._auth.getAuth()?.user.email) {
      this.emailData.to = to;
    }
  }

  goBack(): void {
    this._location.back();
  }

  handleFileInput(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        this.readFile(files[i]);
      }
    }
    event.target.value = '';
  }

  readFile(file: File): void {
    if (file.size > 25 * 1024 * 1024) {
      this.uiService.showInformationModal({
        text: this._t.instant('PORTAL.COMMUNICATION.SEND_FILE_TOO_LARGE', { filename: file.name }),
        title: this._t.instant('PORTAL.COMMUNICATION.SEND_FILE_LARGE_TITLE'),
        type: UiModalTypeEnum.ERROR,
      });
      this.uiService.showAlertError(
        this._t.instant('PORTAL.COMMUNICATION.SEND_FILE_TOO_LARGE', { filename: file.name })
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64Content = dataUrl.split(',')[1];

      const attachment: Attachment = {
        filename: file.name,
        mimeType: file.type || 'application/octet-stream',
        content: base64Content,
      };

      this.emailData.attachments.push(attachment);
    };

    reader.readAsDataURL(file);
  }

  removeAttachment(index: number): void {
    this.emailData.attachments.splice(index, 1);
  }

  onSubmit(): void {
    this.loading = true;

    if (!this.emailData.to || !this.emailData.subject || !this.emailData.body) {
      this.uiService.showAlertError(
        this._t.instant('PORTAL.COMMUNICATION.SEND_REQUIRED_FIELDS')
      );
      this.loading = false;
      return;
    }

    if (this.emailData.to === this._auth.getAuth()?.user.email) {
      this.uiService.showAlertError(this._t.instant('PORTAL.COMMUNICATION.SEND_TO_SELF'));
      this.loading = false;
      return;
    }

    this.uiService.showLoader();
    this.emailService
      .sendEmail(this.emailData)
      .pipe(
        finalize(() => {
          this.uiService.hideLoader();
          this.loading = false;
        })
      )
      .subscribe({
        next: () => {
          this.uiService.showAlertSuccess(
            this._t.instant('PORTAL.COMMUNICATION.SEND_SUCCESS')
          );
          this.resetForm();
        },
        error: err => {
          this.uiService.showAlertError(
            this._t.instant('PORTAL.COMMUNICATION.SEND_ERROR')
          );
        },
      });
  }

  resetForm(): void {
    this.emailData = {
      to: '',
      subject: '',
      body: '',
      attachments: [],
    };
  }
}
