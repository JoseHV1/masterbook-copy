export interface CreateClaimRequest {
  policy_id: string;
  amount_requested: number;
  description?: string;
  attachments?: Attachment[];
  event_date: string;
  location: string;
  agency_id: string;
  broker_id: string;
  client_id: string;
  insurer_id: string;
}

export interface Attachment {
  name: string;
  file_type: string;
  document: string;
  weight: number;
  uploaded_at?: string;
}
