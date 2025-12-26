import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { EmailService } from 'src/app/shared/services/email.service';
import { UiService } from 'src/app/shared/services/ui.service';

@Component({
  selector: 'app-email-detail',
  templateUrl: './email-detail.component.html',
  styleUrls: ['./email-detail.component.scss'],
})
export class EmailDetailComponent implements OnInit {
  emailDetail: any;
  safeHtmlBody: SafeHtml = '';
  attachment: any[] = [];

  isReplying: boolean = false;
  isForwarding: boolean = false;

  replyText: string = '';
  forwardRecipient: string = '';

  replyType: 'reply' | 'replyAll' = 'reply';

  originalMessageId: string = '';
  threadId: string = '';

  pdfUrl = <string | null>null;

  constructor(
    private activateRoute: ActivatedRoute,
    private _ui: UiService,
    private emailService: EmailService,
    private sanitizer: DomSanitizer,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this._ui.showLoader();

    this.activateRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      this.threadId = id || '';
      this._fetchEmailDetail(id!);
    });
  }

  goBack(): void {
    this._location.back();
  }

  private _fetchEmailDetail(id: string): void {
    this.emailService
      .getEmailDetail(id)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe(resp => {
        resp.messages?.forEach((element: any) => {
          if (element.attachments.length > 0) {
            this.attachment.push(...element.attachments);
          }
        });
        const message = resp.messages.map((message: any) => ({
          ...message,
          safeHtmlBody: this.sanitizer.bypassSecurityTrustHtml(
            message.htmlBody || message.textBody || ''
          ),
        })) as any;
        this.emailDetail = message;

        if (this.emailDetail && this.emailDetail.length > 0) {
          const lastMessage = this.emailDetail[this.emailDetail.length - 1];
          this.threadId = resp.threadId;
          this.originalMessageId = lastMessage.id;
        }
        this._ui.hideLoader();
      });
  }

  getDownloadUrl(
    messageId: string,
    attachmentId: string,
    filename: string
  ): void {
    this.emailService
      .downloadAttachmentFile(messageId, attachmentId)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;

          link.download = filename;
          link.target = '_blank';

          document.body.appendChild(link);
          link.click();

          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        },
        error: err => {
          this._ui.showAlertError(
            'Unauthorized access or error downloading the file.'
          );
        },
      });
  }

  toggleReplyForm(type: 'reply' | 'replyAll'): void {
    this.replyType = type;
    this.isReplying = true;
    this.isForwarding = false;
    this.replyText = '';
  }

  toggleForwardForm(): void {
    this.isForwarding = !this.isForwarding;
    this.isReplying = false;
    this.replyText = '';
    this.forwardRecipient = '';
  }

  cancelReply(): void {
    this.isReplying = false;
    this.replyText = '';
    this.replyType = 'reply';
  }

  cancelForward(): void {
    this.isForwarding = false;
    this.replyText = '';
    this.forwardRecipient = '';
  }

  private prepareReplyRecipients(type: 'reply' | 'replyAll'): {
    to: string;
    cc: string;
  } {
    if (this.emailDetail.length === 0) return { to: '', cc: '' };

    const lastMessage = this.emailDetail[this.emailDetail.length - 1];
    const replyTo = this._extractEmailAddress(lastMessage.from);

    if (type === 'reply') {
      return { to: replyTo, cc: '' };
    }

    const originalTo = lastMessage.to
      .split(',')
      .map((e: any) => this._extractEmailAddress(e))
      .filter(Boolean);
    const originalCc = lastMessage.cc
      .split(',')
      .map((e: any) => this._extractEmailAddress(e))
      .filter(Boolean);

    const allRecipients = new Set([...originalTo, ...originalCc, replyTo]);

    allRecipients.delete(replyTo);

    const ccList = Array.from(allRecipients).join(', ');

    return { to: replyTo, cc: ccList };
  }

  sendReply(): void {
    if (!this.replyText.trim()) return;

    const originalEmailData = this.emailDetail[0];
    const subject = originalEmailData.subject.startsWith('Re:')
      ? originalEmailData.subject
      : `Re: ${originalEmailData.subject}`;

    const { to, cc } = this.prepareReplyRecipients(this.replyType);

    const replyPayload = {
      originalMessageId: this.originalMessageId,
      threadId: this.threadId,
      to: to,
      ccRecipients: cc,
      subject: subject,
      body: this.replyText,
      htmlBody: this.generateHtmlBody(this.replyText),
    };

    this._ui.showLoader();

    this.emailService
      .sendReply(replyPayload, this.threadId, this.originalMessageId)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          this.isReplying = false;
          this.replyText = '';
          this._ui.showAlertSuccess('Reply sent successfully.');
        },
        error: (err: any) => {
          this._ui.showAlertError(
            'Error sending reply. Please check permissions.'
          );
        },
      });
  }

  sendForward(): void {
    if (!this.forwardRecipient.trim() || !this.emailDetail.length) {
      this._ui.showAlertError('You must specify a recipient.');
      return;
    }

    this._ui.showLoader();

    const originalMessage = this.emailDetail[this.emailDetail.length - 1];

    const subject = originalMessage.subject.startsWith('Fwd:')
      ? originalMessage.subject
      : `Fwd: ${originalMessage.subject}`;

    const fullHtmlBody = this.generateForwardBody(
      this.replyText,
      this.emailDetail
    );

    const attachments = this.attachment.map(a => ({
      attachmentId: a.attachmentId,
      filename: a.filename,
      messageId: this.originalMessageId,
    }));

    const forwardPayload = {
      to: this.forwardRecipient.trim(),
      subject: subject,
      body: this.replyText,
      htmlBody: fullHtmlBody,
      attachments: attachments,
    };

    this.emailService
      .sendForward(forwardPayload)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: (resp: any) => {
          this.isForwarding = false;
          this.replyText = '';
          this.forwardRecipient = '';
          this._ui.showAlertSuccess('Email forwarded successfully.');
        },
        error: (err: any) => {
          this._ui.showAlertError(
            'Error forwarding email. Check the console for details.'
          );
        },
      });
  }

  viewAsPdf(): void {
    this._ui.showLoader();
    this.emailService
      .printEmailAsPdf(this.threadId)
      .pipe(finalize(() => this._ui.hideLoader()))
      .subscribe({
        next: (blob: Blob) => {
          const pdfBlob = blob;

          if (pdfBlob.type !== 'application/pdf') {
            this._ui.showAlertError(
              `Unexpected file type: ${pdfBlob.type}. Expected 'application/pdf'.`
            );
          }

          const url = URL.createObjectURL(pdfBlob);
          this.pdfUrl = url;
          window.open(url, '_blank');

          setTimeout(() => {
            if (this.pdfUrl) {
              URL.revokeObjectURL(this.pdfUrl as string);
              this.pdfUrl = null;
            }
          }, 5000);
        },
        error: err => {
          this._ui.showAlertError(
            'Unauthorized access or error downloading the file.'
          );
        },
      });
  }

  private generateForwardBody(userIntroText: string, messages: any[]): string {
    let fullBody = '';

    const introHtml =
      userIntroText.trim().length > 0
        ? `<div style="margin-bottom: 20px;">${this.generateHtmlBody(
            userIntroText
          )}</div>`
        : '';
    fullBody += introHtml;

    const originalMessage = messages[messages.length - 1];

    const quotedHtml = `
      <div style="border-left: 2px solid #ccc; padding-left: 10px; margin-top: 20px; color: #555;">
        <p>---------- Forwarded message ---------</p>
        <p><strong>From:</strong> ${originalMessage.from}</p>
        <p><strong>Date:</strong> ${new Date(
          originalMessage.date
        ).toUTCString()}</p>
        <p><strong>Subject:</strong> ${originalMessage.subject}</p>
        <p><strong>To:</strong> ${originalMessage.to}</p>
        ${
          originalMessage.cc
            ? `<p><strong>CC:</strong> ${originalMessage.cc}</p>`
            : ''
        }
        <hr style="border: none; border-top: 1px solid #eee;">
        <div style="margin-top: 10px;">
          ${originalMessage.htmlBody || originalMessage.textBody || ''}
        </div>
      </div>
    `;

    fullBody += quotedHtml;
    return fullBody;
  }

  private generateHtmlBody(textBody: string): string {
    const htmlContent = textBody.replace(/\n/g, '<br>');
    return `<div style="font-family: Arial, sans-serif; padding: 15px;">${htmlContent}</div>`;
  }

  _extractEmailAddress(from: string): string {
    const match = from.match(/<(.+)>/);
    return match ? match[1] : from;
  }
}
