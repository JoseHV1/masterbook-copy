export interface ResetPasswordRequest {
  code: number;
  password: string;
  password_confirmation: string;
}
