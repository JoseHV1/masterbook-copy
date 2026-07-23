import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbOverrideService {
  private labels = new Map<string, string>();
  private _changed = new Subject<void>();
  readonly changed$ = this._changed.asObservable();

  setLabel(segment: string, label: string): void {
    this.labels.set(segment, label);
    this._changed.next();
  }

  getLabel(segment: string): string | undefined {
    return this.labels.get(segment);
  }
}
