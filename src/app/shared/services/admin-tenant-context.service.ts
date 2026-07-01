import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TenantModel } from '../interfaces/models/tenant.model';

const SESSION_KEY = 'admin_tenant_ctx';

@Injectable({ providedIn: 'root' })
export class AdminTenantContextService {
  private _tenant$ = new BehaviorSubject<TenantModel | null>(
    this._loadFromSession()
  );

  readonly tenant$ = this._tenant$.asObservable();

  get snapshot(): TenantModel | null {
    return this._tenant$.getValue();
  }

  /** null = Global (sin filtro de tenant) */
  setTenant(tenant: TenantModel | null): void {
    this._saveToSession(tenant);
    this._tenant$.next(tenant);
  }

  get filterParam(): string {
    const t = this._tenant$.getValue();
    return t ? `&tenant_id=${t._id}` : '';
  }

  private _loadFromSession(): TenantModel | null {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as TenantModel) : null;
    } catch {
      return null;
    }
  }

  private _saveToSession(tenant: TenantModel | null): void {
    try {
      if (tenant) sessionStorage.setItem(SESSION_KEY, JSON.stringify(tenant));
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // sessionStorage no disponible (ej. modo privado con storage bloqueado)
    }
  }
}
