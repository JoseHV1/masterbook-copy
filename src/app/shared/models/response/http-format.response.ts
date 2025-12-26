export interface HttpFormatResponse<T> {
  page: number;
  recordsPerPage: number;
  totalRecords: number;
  data: T;
}
