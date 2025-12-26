import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { EventDialogComponent } from './components/event-dialog/event-dialog.component';
import { IntegrationsService } from 'src/app/shared/services/integration.service';
import {
  CalendarApiService,
  CalendarEventLite,
} from 'src/app/shared/services/calendar-api.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  connected = false;
  loading = true;

  constructor(
    private dialog: MatDialog,
    private _integrations: IntegrationsService,
    private api: CalendarApiService
  ) {}

  @ViewChild('fc') fc?: FullCalendarComponent;

  async ngOnInit() {
    this.loading = true;
    this._integrations.getIntegrationsStatus().subscribe({
      next: google => {
        this.connected = !!google?.connected;
        this.loading = false;

        if (!this.connected) {
          const returnTo = 'portal/calendar';
          this._integrations.getGoogleAuthUrl(returnTo).subscribe(({ url }) => {
            window.location.href = url;
          });
        } else {
          this.fc?.getApi().refetchEvents();
        }
      },
      error: err => {
        this.loading = false;
        console.error('status failed', err);
      },
    });
  }

  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: this.currentView,
    headerToolbar: false,
    height: 'parent',
    expandRows: true,
    dayMaxEventRows: true,
    nowIndicator: true,
    selectable: true,
    editable: true,
    eventTimeFormat: { hour: '2-digit', minute: '2-digit', meridiem: false },

    select: sel => this.openCreateDialog(sel.start, sel.end, sel.allDay),
    eventClick: ({ event }) => this.openEditDialog(event),

    events: async (info, success, failure) => {
      try {
        if (!this.connected) return success([]);
        const events = await this.fetchEvents(info.startStr, info.endStr);
        success(events);
      } catch (e) {
        console.error('fetchEvents failed', e);
        failure(e as any);
      }
    },

    eventDrop: ({ event }) => this.persistMove(event),
    eventResize: ({ event }) => this.persistMove(event),
  };

  // ----- Dialogs -----

  openEditDialog(fcEvent: any) {
    const start = new Date(fcEvent.start);
    const end = new Date(fcEvent.end ?? fcEvent.start);
    const allDay = fcEvent.allDay;

    const ref = this.dialog.open(EventDialogComponent, {
      data: {
        mode: 'edit',
        title: fcEvent.title,
        start,
        end,
        allDay,
        meetUrl: fcEvent.extendedProps?.meetUrl,
        attendees: fcEvent.extendedProps?.attendees,
        description: fcEvent.extendedProps?.description,
        location: fcEvent.extendedProps?.location,
      },
    });

    ref.afterClosed().subscribe(async result => {
      if (!result) return;
      try {
        if (result.action === 'delete') {
          await firstValueFrom(this.api.remove(fcEvent.id));
          this.fc?.getApi().refetchEvents();
          return;
        }
        if (result.allDay) {
          await firstValueFrom(
            this.api.update(fcEvent.id, {
              title: result.title,
              description: result.description,
              location: result.location,
              startIso: result.startDate, // YYYY-MM-DD
              endIso: result.endDate, // YYYY-MM-DD (end exclusive)
              allDay: true,
              timeZone: result.timeZone,
              attendees: result.attendees,
              // createMeetLink on update is optional; add here if you want to support it
            })
          );
        } else {
          await firstValueFrom(
            this.api.update(fcEvent.id, {
              title: result.title,
              description: result.description,
              location: result.location,
              startIso: result.startIso, // UTC instant
              endIso: result.endIso, // UTC instant
              timeZone: result.timeZone,
              attendees: result.attendees,
              // createMeetLink: result.createMeetLink, // enable if you want to add Meet on edit
            })
          );
        }
        this.fc?.getApi().refetchEvents();
      } catch (e) {
        console.error('update event failed', e);
      }
    });
  }

  openCreateDialog(start: Date, end: Date, allDay: boolean) {
    const ref = this.dialog.open(EventDialogComponent, {
      data: { mode: 'create', start, end, allDay },
      autoFocus: 'first-tabbable',
    });

    ref.afterClosed().subscribe(async result => {
      if (!result) return;
      try {
        if (result.allDay) {
          await firstValueFrom(
            this.api.create({
              title: result.title,
              description: result.description,
              location: result.location,
              // backend will map these to start.date / end.date
              startIso: result.startDate, // YYYY-MM-DD
              endIso: result.endDate, // YYYY-MM-DD (end exclusive)
              allDay: true,
              timeZone: result.timeZone,
              attendees: result.attendees,
              createMeetLink: result.createMeetLink, // generate Meet + send invites
            })
          );
        } else {
          await firstValueFrom(
            this.api.create({
              title: result.title,
              description: result.description,
              location: result.location,
              startIso: result.startIso, // UTC instant
              endIso: result.endIso, // UTC instant
              allDay: false,
              timeZone: result.timeZone, // interpret/render correctly
              attendees: result.attendees,
              createMeetLink: result.createMeetLink,
            })
          );
        }
        this.fc?.getApi().refetchEvents();
      } catch (e) {
        console.error('create event failed', e);
      }
    });
  }

  // ----- Backend wiring -----

  private async fetchEvents(
    fromISO: string,
    toISO: string
  ): Promise<EventInput[]> {
    const items: CalendarEventLite[] = await firstValueFrom(
      this.api.list(fromISO, toISO)
    );
    return items.map(e => ({
      id: e.id,
      title: e.title,
      start: e.start,
      end: e.end,
      allDay: e.allDay,
      extendedProps: {
        meetUrl: e.meetUrl,
        attendees: e.attendees,
        description: e.description,
        location: e.location,
      },
    }));
  }

  private async persistMove(event: any) {
    try {
      await firstValueFrom(
        this.api.update(event.id, {
          startIso: event.start?.toISOString(),
          endIso: (event.end ?? event.start)?.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
      this.fc?.getApi().refetchEvents();
    } catch (e) {
      console.error('move/resize update failed', e);
      event.revert && event.revert();
    }
  }

  // ----- Toolbar helpers -----

  gotoToday() {
    this.fc?.getApi().today();
    this.fc?.getApi().refetchEvents();
  }

  nav(direction: 'prev' | 'next') {
    const api = this.fc?.getApi();
    if (!api) return;
    direction === 'prev' ? api.prev() : api.next();
    api.refetchEvents();
  }

  changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
    this.currentView = view;
    const api = this.fc?.getApi();
    api?.changeView(view);
    api?.refetchEvents();
  }
}
