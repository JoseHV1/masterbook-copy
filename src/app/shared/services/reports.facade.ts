import { Injectable, signal } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ApiService } from '@shared/services/api.service';

// ---- Models (inline to keep everything in one file) ----
export type ReportEntityKey = 'policies' | 'invoices';

export interface ReportColumn {
  key: string;
  label: string;
  format?: 'date' | 'currency' | 'number' | 'text';
}

export interface ReportFilter {
  key: string;
  label: string;
  type: 'daterange' | 'select' | 'multiselect' | 'number' | 'text';
  options?: string[];
  field?: string;
}

export interface ReportOperation {
  key: 'group_by' | 'aggregates' | 'sort';
  label: string;
  options: string[];
}

export interface ReportDefinition {
  id: ReportEntityKey;
  label: string;
  defaultColumns: ReportColumn[];
  filters: ReportFilter[];
  operations: ReportOperation[];
  rbacRoles?: string[];
}

export interface ReportRequestPayload {
  definitionId: ReportEntityKey;
  filters: Record<string, any>;
  columns: string[];
  operations: {
    group_by?: string[];
    aggregates?: string[];
    sort?: string;
  };
  format: 'xlsx' | 'csv' | 'pdf';
}

export interface PreviewRow {
  [k: string]: any;
}

export interface PreviewResponse {
  rows: PreviewRow[];
  columns: ReportColumn[];
  estimatedRows: number;
}

export interface ReportRunSummary {
  id: string;
  createdAt: string;
  report: string;
  format: 'CSV' | 'XLSX' | 'PDF';
  status: 'Queued' | 'Running' | 'Done' | 'Failed';
  rows?: number;
  sizeBytes?: number;
  downloadUrl?: string;
}

// ---- Facade (definitions + state + API) ----
@Injectable({ providedIn: 'root' })
export class ReportsFacade {
  // Base path for your Nest endpoints (adjust if needed)
  private readonly base = '/reports';

  // ----- Definitions (schema-driven) -----
  private defs: Record<ReportEntityKey, ReportDefinition> = {
    policies: {
      id: 'policies',
      label: 'Policies',
      defaultColumns: [
        { key: 'number', label: 'Policy #' },
        { key: 'client_name', label: 'Client' },
        { key: 'business_line', label: 'Line' },
        { key: 'premium', label: 'Premium', format: 'currency' },
        { key: 'effective_date', label: 'Effective', format: 'date' },
        { key: 'renewal_date', label: 'Renewal', format: 'date' },
      ],
      filters: [
        {
          key: 'date_range',
          label: 'Effective Date',
          type: 'daterange',
          field: 'effective_date',
        },
        {
          key: 'status',
          label: 'Status',
          type: 'multiselect',
          options: ['active', 'cancelled', 'expired'],
        },
        {
          key: 'business_line',
          label: 'Business Line',
          type: 'select',
          options: ['Auto', 'Life', 'Health'],
        },
        {
          key: 'broker_id',
          label: 'Broker',
          type: 'select',
          options: ['All', 'Alice', 'Bob', 'Carlos'],
        },
        { key: 'min_premium', label: 'Min Premium', type: 'number' },
      ],
      operations: [
        {
          key: 'group_by',
          label: 'Group By',
          options: ['business_line', 'broker_id', 'status'],
        },
        {
          key: 'aggregates',
          label: 'Aggregates',
          options: ['sum(premium)', 'avg(premium)', 'count'],
        },
        {
          key: 'sort',
          label: 'Sort',
          options: ['premium desc', 'effective_date asc'],
        },
      ],
    },
    invoices: {
      id: 'invoices',
      label: 'Invoices',
      defaultColumns: [
        { key: 'invoice_no', label: 'Invoice #' },
        { key: 'client_name', label: 'Client' },
        { key: 'amount', label: 'Amount', format: 'currency' },
        { key: 'status', label: 'Status' },
        { key: 'issued_at', label: 'Issued', format: 'date' },
        { key: 'due_at', label: 'Due', format: 'date' },
      ],
      filters: [
        {
          key: 'issued_range',
          label: 'Issued Date',
          type: 'daterange',
          field: 'issued_at',
        },
        {
          key: 'status',
          label: 'Status',
          type: 'multiselect',
          options: ['pending', 'paid', 'overdue'],
        },
        { key: 'min_amount', label: 'Min Amount', type: 'number' },
      ],
      operations: [
        {
          key: 'group_by',
          label: 'Group By',
          options: ['status', 'client_name'],
        },
        {
          key: 'aggregates',
          label: 'Aggregates',
          options: ['sum(amount)', 'avg(amount)', 'count'],
        },
        {
          key: 'sort',
          label: 'Sort',
          options: ['amount desc', 'issued_at desc'],
        },
      ],
    },
  };

  listDefinitions(): ReportDefinition[] {
    return Object.values(this.defs);
  }
  getDefinition(id: ReportEntityKey): ReportDefinition {
    return this.defs[id];
  }

  // ----- State (signals keep it across routes) -----
  entity = signal<ReportEntityKey>('policies');
  filters = signal<Record<string, any>>({});
  columns = signal<string[]>(this.defs.policies.defaultColumns.map(c => c.key));
  operations = signal<{
    group_by?: string[];
    aggregates?: string[];
    sort?: string;
  }>({});
  format = signal<'xlsx' | 'csv' | 'pdf'>('xlsx');

  resetForEntity(entity: ReportEntityKey) {
    const def = this.getDefinition(entity);
    this.entity.set(entity);
    this.filters.set({});
    this.columns.set(def.defaultColumns.map(c => c.key));
    this.operations.set({});
    this.format.set('xlsx');
  }

  setFilter(key: string, value: any) {
    this.filters.set({ ...this.filters(), [key]: value });
  }
  setOperation(key: 'group_by' | 'aggregates' | 'sort', value: any) {
    this.operations.set({ ...this.operations(), [key]: value });
  }

  toPayload(): ReportRequestPayload {
    return {
      definitionId: this.entity(),
      filters: this.filters(),
      columns: this.columns(),
      operations: this.operations(),
      format: this.format(),
    };
  }

  // ----- API calls (via your ApiService) -----
  constructor(private api: ApiService) {}

  preview(): Observable<PreviewResponse> {
    return this.api
      .post<{ data: PreviewResponse }>(`${this.base}/preview`, this.toPayload())
      .pipe(map(r => r.data));
  }

  run(): Observable<{ run_id: string }> {
    return this.api
      .post<{ data: { run_id: string } }>(`${this.base}/run`, this.toPayload())
      .pipe(map(r => r.data));
  }

  listRuns(params?: { status?: string }): Observable<ReportRunSummary[]> {
    return this.api
      .get<{ data: ReportRunSummary[] }>(`${this.base}/runs`, params as any)
      .pipe(map(r => r.data));
  }
}
