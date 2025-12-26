import { AccountStatusEnum } from '../../shared/enums/account-status.enum';
import { BaseModel } from '../interfaces/models/base.model';
import { DropdownOptionModel } from './dropdown-option.model';
export type ReportType =
  | 'accounts'
  | 'policies'
  | 'requests'
  | 'quotes'
  | 'payments'
  | 'invoices'
  | 'commissions';

export interface ReportTypeConfig {
  show: {
    businessLine?: boolean;
    policyCategory?: boolean;
    policyType?: boolean;
    status?: boolean;
    broker?: boolean;
    insurer?: boolean;
    account?: boolean;
    paymentFrom?: boolean;
    minTotalAmount?: boolean;
    maxTotalAmount?: boolean;
    minCommissionPay?: boolean;
    maxCommissionPay?: boolean;
    minPrimeAmount?: boolean;
    maxPrimeAmount?: boolean;
    minCoverage?: boolean;
    maxCoverage?: boolean;
    minDeductible?: boolean;
    maxDeductible?: boolean;
    groupBy?: boolean;
    aggregate?: boolean;
    sort?: boolean;
  };
  statusOptions?: DropdownOptionModel[];
  groupByOptions?: DropdownOptionModel[];
  aggregateOptions?: DropdownOptionModel[];
  sortOptions?: DropdownOptionModel[];
}

export type GroupBy = '' | 'month' | 'quarter' | 'broker' | 'status';
export type Aggregate = '' | 'sum' | 'avg' | 'count';
export type SortKey =
  | 'date_desc'
  | 'date_asc'
  | 'name_asc'
  | 'name_desc'
  | 'premium_desc'
  | 'premium_asc';
export type OutputFormat = 'xlsx' | 'csv' | 'pdf';

export type DateRangePreset =
  | 'last_7'
  | 'last_30'
  | 'last_90'
  | 'ytd'
  | 'custom';

export interface ReportFilters {
  reportType: ReportType | '';
  businessLine: string | '';
  policyCategory: string | '';
  policyType: string | '';
  effectiveFrom: Date | null;
  effectiveTo: Date | null;
  status: 'active' | 'pending' | 'expired' | 'cancelled' | string;
  broker: string | '';
  insurer: string | '';
  account: string | '';
  paymentFrom: 'Account' | 'Insurer' | string;
  minTotalAmount: number | null;
  maxTotalAmount: number | null;
  minCommissionPay: number | null;
  maxCommissionPay: number | null;
  minPrimeAmount: number | null;
  maxPrimeAmount: number | null;
  minCoverage: number | null;
  maxCoverage: number | null;
  minDeductible: number | null;
  maxDeductible: number | null;
  groupBy: GroupBy;
  aggregate: Aggregate;
  sort: SortKey;
  format: OutputFormat;
}

export interface PreviewInfo {
  reportTypeLabel: string;
  estimatedRecords: number;
  dateRangeLabel: string;
  estimatedSizeLabel: string;
}

export interface HistoryItem extends BaseModel {
  title: string;
  format: OutputFormat;
  url: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
}

export const CONFIG_BY_TYPE: Record<ReportType, ReportTypeConfig> = {
  policies: {
    show: {
      businessLine: true,
      policyCategory: true,
      policyType: true,
      status: true,
      insurer: true,
      minPrimeAmount: true,
      maxPrimeAmount: true,
      minCoverage: true,
      maxCoverage: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'ACTIVE', name: 'Active' },
      { code: 'PENDING', name: 'Pending' },
      { code: 'EXPIRED', name: 'Expired' },
      { code: 'CANCELLED', name: 'Cancelled' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'broker', name: 'Agent' },
      { code: 'insurer', name: 'Insurer' },
      { code: 'business_line', name: 'Business Line' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'prime_amount_desc', name: 'Premium Amount (High to low)' },
      { code: 'prime_amount_asc', name: 'Premium Amount (Low to high)' },
      { code: 'coverage_desc', name: 'Coverage (High to low)' },
      { code: 'coverage_asc', name: 'Coverage (Low to high)' },
    ],
  },
  accounts: {
    show: {
      status: true,
      broker: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: AccountStatusEnum.ACTIVE, name: 'Active' },
      { code: AccountStatusEnum.INACTIVE, name: 'Inactive' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'broker', name: 'Broker' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'count', name: 'Count' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'commission_desc', name: 'Commission (High to low)' },
      { code: 'commission_asc', name: 'Commission (Low to high)' },
    ],
  },
  requests: {
    show: {
      status: true,
      minCoverage: true,
      maxCoverage: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'PENDING_QUOTES', name: 'Pending Quotes' },
      { code: 'PENDING_SELECTION', name: 'Pending Selection' },
      { code: 'QUOTE_SELECTED', name: 'Quote Selected' },
      { code: 'CLOSED', name: 'Closed' },
      { code: 'REJECTED', name: 'Rejected' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'amount_desc', name: 'Amount (High to low)' },
      { code: 'amount_asc', name: 'Amount (Low to high)' },
    ],
  },
  quotes: {
    show: {
      status: true,
      insurer: true,
      minPrimeAmount: true,
      maxPrimeAmount: true,
      minCoverage: true,
      maxCoverage: true,
      minDeductible: true,
      maxDeductible: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'ACCEPTED', name: 'Accepted' },
      { code: 'NOT_ACCEPTED', name: 'Not Accepted' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'insurer', name: 'Insurer' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'prime_amount_desc', name: 'Premium Amount (High to low)' },
      { code: 'prime_amount_asc', name: 'Premium Amount (Low to high)' },
      { code: 'coverage_desc', name: 'Coverage (High to low)' },
      { code: 'coverage_asc', name: 'Coverage (Low to high)' },
      { code: 'deductible_desc', name: 'Deductible (High to low)' },
      { code: 'deductible_asc', name: 'Deductible (Low to high)' },
    ],
  },
  payments: {
    show: {
      status: true,
      insurer: true,
      account: true,
      paymentFrom: true,
      minTotalAmount: true,
      maxTotalAmount: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'full_paid', name: 'Fully Used' },
      { code: 'partially_paid', name: 'Partially Used' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'insurer', name: 'Insurer' },
      { code: 'account', name: 'Account' },
      { code: 'payment_from', name: 'Payment From' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'total_amount_desc', name: 'Total Amount (High to low)' },
      { code: 'total_amount_asc', name: 'Total Amount (Low to high)' },
    ],
  },
  invoices: {
    show: {
      status: true,
      paymentFrom: true,
      insurer: true,
      account: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'paid', name: 'Paid' },
      { code: 'partially_paid', name: 'Partially Paid' },
      { code: 'unpaid', name: 'Unpaid' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'insurer', name: 'Insurer' },
      { code: 'account', name: 'Account' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
    ],
  },
  commissions: {
    show: {
      status: true,
      broker: true,
      minCommissionPay: true,
      maxCommissionPay: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: 'APPROVED', name: 'Approved' },
      { code: 'PENDING', name: 'Pending' },
      { code: 'REJECTED', name: 'Rejected' },
    ],
    groupByOptions: [
      { code: '', name: 'No grouping' },
      { code: 'month', name: 'Month' },
      { code: 'broker', name: 'Broker' },
      { code: 'status', name: 'Status' },
    ],
    aggregateOptions: [
      { code: '', name: 'No aggregates' },
      { code: 'sum', name: 'Sum' },
      { code: 'avg', name: 'Average' },
    ],
    sortOptions: [
      { code: 'date_desc', name: 'Date (Newest first)' },
      { code: 'date_asc', name: 'Date (Oldest first)' },
      { code: 'pay_to_asc', name: 'Pay to (Newest first)' },
      { code: 'pay_to_desc', name: 'Pay to (Oldest first)' },
    ],
  },
};
