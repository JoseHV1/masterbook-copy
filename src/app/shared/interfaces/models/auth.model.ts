import { PopulatedUserModel } from './user.model';

export interface AuthModel {
  token: string;
  user: Partial<PopulatedUserModel>;
}
