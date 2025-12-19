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
  options?: string[]; // for select/multiselect
  field?: string; // underlying field for daterange
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
