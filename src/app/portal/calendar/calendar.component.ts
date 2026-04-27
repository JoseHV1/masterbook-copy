import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
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
  isMobile = window.innerWidth < 768;
  currentDateLabel = '';
  goToDateValue = '';
  showSearch = false;
  searchFilters = { what: '', who: '', where: '', doesntHave: '', dateFrom: '', dateTo: '' };
  private _activeSearch: typeof this.searchFilters | null = null;
  private _navTarget = '';

  get hasActiveSearch(): boolean {
    return !!this._activeSearch;
  }

  constructor(
    private dialog: MatDialog,
    private _integrations: IntegrationsService,
    private api: CalendarApiService
  ) {}

  @ViewChild('fc') fc?: FullCalendarComponent;

  @HostListener('document:click')
  closeDropdowns(): void {
    this.showSearch = false;
  }

  @HostListener('window:resize')
  onResize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 768;
    if (wasMobile !== this.isMobile) {
      this.changeView(this.isMobile ? 'timeGridDay' : 'timeGridWeek');
    }
    // fc-container height is CSS-driven (calc), FullCalendar will re-render automatically
  }

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

  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' = window.innerWidth < 768 ? 'timeGridDay' : 'timeGridWeek';

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
      this.currentDateLabel = info.view.title;
      if (info.view.type === 'timeGridDay') {
        this._navTarget = info.startStr.slice(0, 10);
      }
      this._applyNavTargetHighlight();
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
    const items: CalendarEventLite[] = await firstValueFrom(this.api.list(fromISO, toISO));
    let events: EventInput[] = items.map(e => ({
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

    if (this._activeSearch) {
      const f = this._activeSearch;
      events = events.filter(ev => {
        if (f.what) {
          const kw = f.what.toLowerCase();
          const inTitle = (ev.title as string)?.toLowerCase().includes(kw);
          const inDesc = ((ev.extendedProps as any)?.description as string)?.toLowerCase().includes(kw);
          if (!inTitle && !inDesc) return false;
        }
        if (f.who) {
          const kw = f.who.toLowerCase();
          const attendees: string[] = (ev.extendedProps as any)?.attendees ?? [];
          if (!attendees.some((a: string) => a.toLowerCase().includes(kw))) return false;
        }
        if (f.where) {
          const kw = f.where.toLowerCase();
          const loc = ((ev.extendedProps as any)?.location as string)?.toLowerCase() ?? '';
          if (!loc.includes(kw)) return false;
        }
        if (f.doesntHave) {
          const kw = f.doesntHave.toLowerCase();
          const inTitle = (ev.title as string)?.toLowerCase().includes(kw);
          const inDesc = ((ev.extendedProps as any)?.description as string)?.toLowerCase().includes(kw);
          if (inTitle || inDesc) return false;
        }
        if (f.dateFrom) {
          const evStart = ev.start ? new Date(ev.start as string) : null;
          if (evStart && evStart < new Date(f.dateFrom)) return false;
        }
        if (f.dateTo) {
          const evEnd = ev.end
            ? new Date(ev.end as string)
            : ev.start ? new Date(ev.start as string) : null;
          if (evEnd && evEnd > new Date(f.dateTo + 'T23:59:59')) return false;
        }
        return true;
      });
    }

    return events;
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

  gotoDate(): void {
    if (!this.goToDateValue) return;
    this._navTarget = this.goToDateValue;
    this.fc?.getApi().gotoDate(this.goToDateValue);
    this.showSearch = false;
    this.goToDateValue = '';
  }

  applySearch(): void {
    this._activeSearch = { ...this.searchFilters };
    this.showSearch = false;
    this.fc?.getApi().refetchEvents();
  }

  resetSearch(): void {
    this.searchFilters = { what: '', who: '', where: '', doesntHave: '', dateFrom: '', dateTo: '' };
    this._activeSearch = null;
    this.showSearch = false;
    this.fc?.getApi().refetchEvents();
  }

  gotoToday() {
    this._navTarget = '';
    this.fc?.getApi().today();
    this.fc?.getApi().refetchEvents();
  }

  nav(direction: 'prev' | 'next') {
    if (this.currentView !== 'timeGridDay') this._navTarget = '';
    const api = this.fc?.getApi();
    if (!api) return;
    direction === 'prev' ? api.prev() : api.next();
    api.refetchEvents();
  }

  changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
    if (view !== 'timeGridDay') this._navTarget = '';
    this.currentView = view;
    const api = this.fc?.getApi();
    api?.changeView(view);
    api?.refetchEvents();
  }

  private _applyNavTargetHighlight(): void {
    setTimeout(() => {
      document.querySelectorAll('.fc-col-header-cell.fc-nav-target')
        .forEach(el => el.classList.remove('fc-nav-target'));

      const today = new Date().toISOString().slice(0, 10);

      // Always underline today when visible
      document.querySelector(`.fc-col-header-cell[data-date="${today}"]`)
        ?.classList.add('fc-nav-target');

      // Also underline the explicit Go-To target if it differs from today
      if (this._navTarget && this._navTarget !== today) {
        document.querySelector(`.fc-col-header-cell[data-date="${this._navTarget}"]`)
          ?.classList.add('fc-nav-target');
      }
    }, 50);
  }
}
