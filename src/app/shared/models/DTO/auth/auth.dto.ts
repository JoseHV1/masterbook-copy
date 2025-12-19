import { UserDTO } from '../user/user.dto';
import { AuthBackendEntity } from './auth.back-entity';
import { AuthModel } from './auth.model';

export class AuthDTO {
  public static mapTo(param: AuthBackendEntity): AuthModel {
    return {
      accessToken: param.access_token,
      refreshToken: param.refresh_token,
      tokenType: param.token_type,
      data: UserDTO.mapTo(param.data),
    };
  }

  public static mapFrom(param: AuthModel): AuthBackendEntity {
    return {
      access_token: param.accessToken,
      refresh_token: param.refreshToken,
      token_type: param.tokenType,
      data: UserDTO.mapFrom(param.data),
    };
  }
}
