import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type EventDialogData = {
  mode: 'create' | 'edit';
  title?: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;

  description?: string;
  location?: string;
  meetUrl?: string;
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
};

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
})
export class EventDialogComponent {
  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EventDialogData
  ) {}

  private formatTime(d: Date): string {
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  }
  private mergeDateAndTime(date: Date, hhmm: string): Date {
    const [hh, mm] = (hhmm || '00:00').split(':').map(n => parseInt(n, 10));
    const out = new Date(date);
    out.setHours(hh || 0, mm || 0, 0, 0);
    return out;
  }
  private toDateStringYYYYMMDD(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private presetAttendeesText =
    (this.data.attendees || [])
      .map(a => a.email)
      .filter(Boolean)
      .join(', ') || '';

  form = this.fb.group({
    title: [
      this.data.title ?? '',
      [Validators.required, Validators.maxLength(200)],
    ],
    description: [this.data.description ?? ''],
    location: [this.data.location ?? ''],

    allDay: [this.data.allDay ?? false],
    startDate: [this.data.start ?? new Date(), Validators.required],
    startTime: [this.formatTime(this.data.start ?? new Date())],
    endDate: [
      this.data.end ?? new Date(Date.now() + 60 * 60 * 1000),
      Validators.required,
    ],
    endTime: [
      this.formatTime(this.data.end ?? new Date(Date.now() + 60 * 60 * 1000)),
    ],

    attendeesText: [this.presetAttendeesText],

    createMeetLink: [!this.data.meetUrl],
  });

  private parseAttendees(text: string | null | undefined) {
    if (!text) return [];
    const parts = text
      .split(/[\s,;]+/)
      .map(s => s.trim())
      .filter(Boolean);
    return parts.map(email => ({ email }));
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    let start = v.startDate!;
    let end = v.endDate!;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const attendees = this.parseAttendees(v.attendeesText);

    if (!v.allDay) {
      start = this.mergeDateAndTime(v.startDate!, v.startTime || '00:00');
      end = this.mergeDateAndTime(v.endDate!, v.endTime || '00:00');

      if (end <= start) {
        alert('End must be after start.');
        return;
      }

      this.ref.close({
        title: v.title!.trim(),
        description: v.description?.trim() || '',
        location: v.location?.trim() || '',
        allDay: false,
        startIso: start.toISOString(),
        endIso: end.toISOString(),
        timeZone,
        attendees,
        createMeetLink: !this.data.meetUrl && !!v.createMeetLink,
      });
    } else {
      // all-day: start 00:00 local; end exclusive next-day 00:00
      const startAt00 = this.mergeDateAndTime(v.startDate!, '00:00');
      const endExclusive = new Date(v.endDate!);
      endExclusive.setDate(endExclusive.getDate() + 1);

      if (endExclusive <= startAt00) {
        alert('End must be after start.');
        return;
      }

      this.ref.close({
        title: v.title!.trim(),
        description: v.description?.trim() || '',
        location: v.location?.trim() || '',
        allDay: true,
        startIso: this.toDateStringYYYYMMDD(startAt00), // YYYY-MM-DD
        endIso: this.toDateStringYYYYMMDD(endExclusive), // YYYY-MM-DD (exclusive)
        timeZone,
        attendees,
        createMeetLink: !this.data.meetUrl && !!v.createMeetLink,
      });
    }
  }

  deleteEvent() {
    const confirmed = confirm('Delete this event? This cannot be undone.');
    if (!confirmed) return;
    this.ref.close({ action: 'delete' });
  }

  cancel() {
    this.ref.close();
  }
}
