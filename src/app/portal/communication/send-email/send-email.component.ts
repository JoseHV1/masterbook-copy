import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { UiModalTypeEnum } from '@app/shared/enums/ui-modal-type.enum';
import { finalize } from 'rxjs';
import {
  Attachment,
  EmailPayload,
  EmailService,
} from 'src/app/shared/services/email.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.component.html',
  styleUrls: ['./send-email.component.scss'],
})
export class SendEmailComponent {
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
    private _location: Location
  ) {}

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
        text: `The file "${file.name}" is too large (> 25MB) to be attached.`,
        title: 'File too large',
        type: UiModalTypeEnum.ERROR,
      });
      this.uiService.showAlertError(
        `The file "${file.name}" is too large (> 25MB) to be attached.`
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
        'Please complete the Recipient, Subject, and Body fields.'
      );
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
            'The email has been sent successfully.'
          );
          this.resetForm();
        },
        error: err => {
          this.uiService.showAlertError(
            'Error sending the email. Please verify the recipient, permissions, or email format.'
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
