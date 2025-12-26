export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
  repeat_new_password: string;
}
