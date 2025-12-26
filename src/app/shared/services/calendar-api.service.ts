import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponseModel } from '../interfaces/models/api-response.model';

export interface CalendarEventLite {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  meetUrl?: string;
  description?: string;
  location?: string;
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
}

export interface CreateEventPayload {
  title: string;
  startIso: string; // timed => ISO instant, all-day => 'YYYY-MM-DD'
  endIso: string; // timed => ISO instant, all-day => 'YYYY-MM-DD' (end exclusive)
  allDay?: boolean; // tells backend to use date vs. dateTime
  timeZone?: string;
  description?: string;
  location?: string;
  attendees?: { email: string; displayName?: string }[];
  createMeetLink?: boolean;
}

export interface UpdateEventPayload {
  title?: string;
  startIso?: string;
  endIso?: string;
  allDay?: boolean;
  timeZone?: string;
  description?: string;
  location?: string;
  attendees?: { email: string; displayName?: string }[];
}

@Injectable({ providedIn: 'root' })
export class CalendarApiService {
  constructor(private _api: ApiService) {}

  list(fromISO: string, toISO: string): Observable<CalendarEventLite[]> {
    return this._api
      .get<ApiResponseModel<{ items: CalendarEventLite[] }>>(
        `/integrations/google/events?from=${encodeURIComponent(
          fromISO
        )}&to=${encodeURIComponent(toISO)}`
      )
      .pipe(
        // tap(r => console.log('events list raw:', r)),
        map(r => r.data.items)
      );
  }

  create(
    payload: CreateEventPayload
  ): Observable<{ id: string; htmlLink?: string }> {
    return this._api
      .post<ApiResponseModel<{ item: { id: string; htmlLink?: string } }>>(
        `/integrations/google/events`,
        payload
      )
      .pipe(
        // tap(r => console.log('event create raw:', r)),
        map(r => r.data.item)
      );
  }

  update(id: string, patch: UpdateEventPayload): Observable<{ id: string }> {
    return this._api
      .patch<ApiResponseModel<{ item: { id: string } }>>(
        `/integrations/google/events/${encodeURIComponent(id)}`,
        patch
      )
      .pipe(
        // tap(r => console.log('event update raw:', r)),
        map(r => r.data.item)
      );
  }

  remove(id: string): Observable<{ ok: boolean }> {
    return this._api
      .delete<ApiResponseModel<{ ok: boolean }>>(
        `/integrations/google/events/${encodeURIComponent(id)}`
      )
      .pipe(
        // tap(r => console.log('event delete raw:', r)),
        map(r => r.data)
      );
  }
}
