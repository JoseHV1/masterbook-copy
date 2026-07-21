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
    paymentMethod?: boolean;
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
  paymentMethod: string | '';
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

export const REPORT_OPTIONS_I18N_PREFIX = 'PORTAL.REPORTS.CREATE.OPTIONS';
const OPT = REPORT_OPTIONS_I18N_PREFIX;

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
      { code: '', name: `${OPT}.ALL` },
      { code: 'ACTIVE', name: `${OPT}.STATUS.ACTIVE` },
      { code: 'CANCELLED', name: `${OPT}.STATUS.CANCELLED` },
      { code: 'EXPIRED', name: `${OPT}.STATUS.EXPIRED` },
      { code: 'PENDING', name: `${OPT}.STATUS.PENDING` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'broker', name: `${OPT}.GROUP_BY.AGENT` },
      { code: 'insurer', name: `${OPT}.GROUP_BY.INSURER` },
      { code: 'business_line', name: `${OPT}.GROUP_BY.BUSINESS_LINE` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'prime_amount_desc', name: `${OPT}.SORT.PREMIUM_DESC` },
      { code: 'prime_amount_asc', name: `${OPT}.SORT.PREMIUM_ASC` },
      { code: 'coverage_desc', name: `${OPT}.SORT.COVERAGE_DESC` },
      { code: 'coverage_asc', name: `${OPT}.SORT.COVERAGE_ASC` },
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
      { code: '', name: `${OPT}.ALL` },
      { code: AccountStatusEnum.ACTIVE, name: `${OPT}.STATUS.ACTIVE` },
      { code: AccountStatusEnum.INACTIVE, name: `${OPT}.STATUS.INACTIVE` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'broker', name: `${OPT}.GROUP_BY.BROKER` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'count', name: `${OPT}.AGGREGATE.COUNT` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'commission_desc', name: `${OPT}.SORT.COMMISSION_DESC` },
      { code: 'commission_asc', name: `${OPT}.SORT.COMMISSION_ASC` },
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
      { code: '', name: `${OPT}.ALL` },
      { code: 'CLOSED', name: `${OPT}.STATUS.CLOSED` },
      { code: 'PENDING_QUOTES', name: `${OPT}.STATUS.PENDING_QUOTES` },
      { code: 'PENDING_SELECTION', name: `${OPT}.STATUS.PENDING_SELECTION` },
      { code: 'QUOTE_SELECTED', name: `${OPT}.STATUS.QUOTE_SELECTED` },
      { code: 'REJECTED', name: `${OPT}.STATUS.REJECTED` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'amount_desc', name: `${OPT}.SORT.AMOUNT_DESC` },
      { code: 'amount_asc', name: `${OPT}.SORT.AMOUNT_ASC` },
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
      { code: '', name: `${OPT}.ALL` },
      { code: 'ACCEPTED', name: `${OPT}.STATUS.ACCEPTED` },
      { code: 'NOT_ACCEPTED', name: `${OPT}.STATUS.NOT_ACCEPTED` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'insurer', name: `${OPT}.GROUP_BY.INSURER` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'prime_amount_desc', name: `${OPT}.SORT.PREMIUM_DESC` },
      { code: 'prime_amount_asc', name: `${OPT}.SORT.PREMIUM_ASC` },
      { code: 'coverage_desc', name: `${OPT}.SORT.COVERAGE_DESC` },
      { code: 'coverage_asc', name: `${OPT}.SORT.COVERAGE_ASC` },
      { code: 'deductible_desc', name: `${OPT}.SORT.DEDUCTIBLE_DESC` },
      { code: 'deductible_asc', name: `${OPT}.SORT.DEDUCTIBLE_ASC` },
    ],
  },
  payments: {
    show: {
      status: true,
      insurer: true,
      account: true,
      paymentFrom: true,
      paymentMethod: true,
      minTotalAmount: true,
      maxTotalAmount: true,
      groupBy: true,
      aggregate: true,
      sort: true,
    },
    statusOptions: [
      { code: '', name: `${OPT}.ALL` },
      { code: 'available', name: `${OPT}.STATUS.AVAILABLE` },
      { code: 'full_paid', name: `${OPT}.STATUS.FULL_PAID` },
      { code: 'partially_paid', name: `${OPT}.STATUS.PARTIALLY_PAID` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'insurer', name: `${OPT}.GROUP_BY.INSURER` },
      { code: 'account', name: `${OPT}.GROUP_BY.ACCOUNT` },
      { code: 'payment_from', name: `${OPT}.GROUP_BY.PAYMENT_FROM` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'total_amount_desc', name: `${OPT}.SORT.TOTAL_AMOUNT_DESC` },
      { code: 'total_amount_asc', name: `${OPT}.SORT.TOTAL_AMOUNT_ASC` },
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
      { code: '', name: `${OPT}.ALL` },
      { code: 'paid', name: `${OPT}.STATUS.PAID` },
      { code: 'partially_paid', name: `${OPT}.STATUS.PARTIALLY_PAID` },
      { code: 'unpaid', name: `${OPT}.STATUS.UNPAID` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'insurer', name: `${OPT}.GROUP_BY.INSURER` },
      { code: 'account', name: `${OPT}.GROUP_BY.ACCOUNT` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
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
      { code: '', name: `${OPT}.ALL` },
      { code: 'APPROVED', name: `${OPT}.STATUS.APPROVED` },
      { code: 'PENDING', name: `${OPT}.STATUS.PENDING` },
      { code: 'REJECTED', name: `${OPT}.STATUS.REJECTED` },
    ],
    groupByOptions: [
      { code: '', name: `${OPT}.GROUP_BY.NONE` },
      { code: 'month', name: `${OPT}.GROUP_BY.MONTH` },
      { code: 'broker', name: `${OPT}.GROUP_BY.BROKER` },
      { code: 'status', name: `${OPT}.GROUP_BY.STATUS` },
    ],
    aggregateOptions: [
      { code: '', name: `${OPT}.AGGREGATE.NONE` },
      { code: 'sum', name: `${OPT}.AGGREGATE.SUM` },
      { code: 'avg', name: `${OPT}.AGGREGATE.AVERAGE` },
    ],
    sortOptions: [
      { code: 'date_desc', name: `${OPT}.SORT.DATE_DESC` },
      { code: 'date_asc', name: `${OPT}.SORT.DATE_ASC` },
      { code: 'pay_to_asc', name: `${OPT}.SORT.PAY_TO_NEWEST` },
      { code: 'pay_to_desc', name: `${OPT}.SORT.PAY_TO_OLDEST` },
    ],
  },
};
