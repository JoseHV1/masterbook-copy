import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = 'timeGridWeek';

  // Toolbar: current period label
  currentTitle = '…';
  private currentRangeStart = '';
  private currentRangeEnd = '';

  // Search
  searchOpen = false;
  searchResults: CalendarEventLite[] | null = null;
  searchLoading = false;

  searchForm = new FormGroup({
    what: new FormControl(''),
    who: new FormControl(''),
    where: new FormControl(''),
    doesntHave: new FormControl(''),
    dateFrom: new FormControl(''),
    dateTo: new FormControl(''),
  });

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

    datesSet: info => {
      this.currentTitle = info.view.title;
      this.currentRangeStart = info.startStr;
      this.currentRangeEnd = info.endStr;
    },

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

  // ----- Search -----

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (!this.searchOpen) {
      this.searchResults = null;
      this.searchForm.reset();
    }
  }

  async doSearch() {
    const v = this.searchForm.getRawValue();
    const what = v.what ?? '';
    const who = v.who ?? '';
    const whereVal = v.where ?? '';
    const doesntHave = v.doesntHave ?? '';
    const dateFrom = v.dateFrom ?? '';
    const dateTo = v.dateTo ?? '';

    // If a text query exists but no dates → search all history (pass empty range)
    // If no query and no dates → stay within current view range
    const hasTextQuery = !!(what.trim() || who.trim() || whereVal.trim());
    const from = dateFrom
      ? new Date(dateFrom + 'T00:00:00').toISOString()
      : hasTextQuery ? '' : this.currentRangeStart;
    const to = dateTo
      ? new Date(dateTo + 'T23:59:59').toISOString()
      : hasTextQuery ? '' : this.currentRangeEnd;

    this.searchLoading = true;
    try {
      // Combine what + who + where into one `q` so Google searches all fields
      // server-side (title, description, location, attendees) across all history.
      // Client-side filters below then add field-specific precision on top.
      const combinedQ = [what, who, whereVal]
        .map(s => s.trim())
        .filter(Boolean)
        .join(' ');

      let results = await firstValueFrom(
        this.api.list(from, to, combinedQ || undefined)
      );

      // `who` and `where` are more specific client-side filters
      if (who.trim()) {
        const q = who.toLowerCase();
        results = results.filter(e =>
          e.attendees?.some(
            a =>
              a.email?.toLowerCase().includes(q) ||
              a.displayName?.toLowerCase().includes(q)
          )
        );
      }

      if (whereVal.trim()) {
        const q = whereVal.toLowerCase();
        results = results.filter(e => e.location?.toLowerCase().includes(q));
      }

      if (doesntHave.trim()) {
        const q = doesntHave.toLowerCase();
        results = results.filter(
          e =>
            !e.title?.toLowerCase().includes(q) &&
            !e.description?.toLowerCase().includes(q)
        );
      }

      this.searchResults = results;
    } catch (e) {
      console.error('search failed', e);
    } finally {
      this.searchLoading = false;
    }
  }

  resetSearch() {
    this.searchForm.reset();
    this.searchResults = null;
  }

  goToEvent(event: CalendarEventLite) {
    this.searchOpen = false;
    this.searchResults = null;
    this.searchForm.reset();
    this.fc?.getApi().gotoDate(new Date(event.start));
  }

  jumpToDate(date: Date | null) {
    if (date) this.fc?.getApi().gotoDate(date);
  }

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
              startIso: result.startDate,
              endIso: result.endDate,
              allDay: true,
              timeZone: result.timeZone,
              attendees: result.attendees,
            })
          );
        } else {
          await firstValueFrom(
            this.api.update(fcEvent.id, {
              title: result.title,
              description: result.description,
              location: result.location,
              startIso: result.startIso,
              endIso: result.endIso,
              timeZone: result.timeZone,
              attendees: result.attendees,
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
              startIso: result.startDate,
              endIso: result.endDate,
              allDay: true,
              timeZone: result.timeZone,
              attendees: result.attendees,
              createMeetLink: result.createMeetLink,
            })
          );
        } else {
          await firstValueFrom(
            this.api.create({
              title: result.title,
              description: result.description,
              location: result.location,
              startIso: result.startIso,
              endIso: result.endIso,
              allDay: false,
              timeZone: result.timeZone,
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

  private async fetchEvents(fromISO: string, toISO: string): Promise<EventInput[]> {
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

  // ----- Toolbar -----

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
