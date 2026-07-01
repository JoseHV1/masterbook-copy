import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TenantModel } from '../interfaces/models/tenant.model';

@Injectable({ providedIn: 'root' })
export class TenantContextService {
  private _tenant$ = new BehaviorSubject<TenantModel | null>(null);

  readonly tenant$ = this._tenant$.asObservable();

  get snapshot(): TenantModel | null {
    return this._tenant$.getValue();
  }

  setTenant(tenant: TenantModel | null): void {
    this._tenant$.next(tenant);
  }
}
