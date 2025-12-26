import { UserBackendEntity } from '../user/user.back-entity';

export interface AuthBackendEntity {
  access_token: string;
  refresh_token: string;
  token_type: string;
  data: UserBackendEntity;
}
