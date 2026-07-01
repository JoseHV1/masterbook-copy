import { StripeBillingStatusEnum } from '../../enums/stripe-billing-status.enum';

export interface StripeBillingModel {
  _id: string;
  serial: string;
  agency_id: string;
  tenant_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  stripe_invoice_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_event_id: string;
  stripe_event_type: string;
  status: StripeBillingStatusEnum;
  amount: number;
  currency: string;
  description: string | null;
  period_start: string | null;
  period_end: string | null;
  paid_at: string | null;
  createdAt: string;
  updatedAt: string;
  agency?: { name: string; serial: string };
  tenant?: { name: string; code: string };
}
