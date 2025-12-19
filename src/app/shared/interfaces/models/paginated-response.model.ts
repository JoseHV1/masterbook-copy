export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total_records: number;
  records: T;
}

export interface PaginatedResponses<T> {
  page: number;
  limit: number;
  totalPages: number;
  items: T;
}
