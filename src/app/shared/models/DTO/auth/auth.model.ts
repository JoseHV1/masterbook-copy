import { UserModel } from '../user/user.model';

export interface AuthModel {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  data: UserModel;
}
