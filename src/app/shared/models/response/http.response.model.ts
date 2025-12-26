export interface HttpResponseModel<T> {
  success: boolean;
  message: string;
  code: number | string;
  data: T;
}
