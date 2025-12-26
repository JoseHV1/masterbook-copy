export interface RequestDetailsBackendEntity {
  id: string;
  price: string | number;
  sequential_identifier: number;
  status: string;
  created_at: string;
  updated_at: string;
  account_id: string;
  broker_id: string;
  request_custom_id: string;
  object_of_insurance: string;
  value: number;
  url: string;
  request_type: string;
  location: string;
  delete_at?: string;
  application: string;
  additional_information: string;
  action_type: string;
  customer_request_link?: string;
}
