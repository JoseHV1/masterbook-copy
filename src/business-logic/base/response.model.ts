export interface ResponseModel<T> {
  code: string;
  data: T;
  message: string;
  success: boolean;
}
