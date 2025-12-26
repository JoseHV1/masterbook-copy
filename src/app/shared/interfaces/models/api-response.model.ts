export interface ApiResponseModel<T> {
  code: string;
  status_code: number;
  success: boolean;
  message: string;
  data: T;
}
