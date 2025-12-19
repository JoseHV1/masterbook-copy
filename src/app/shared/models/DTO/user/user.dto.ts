import { BrokerDTO } from '../broker/broker.dto';
import {
  UserBackendEntity,
  UserByOwnerBackendEntity,
} from './user.back-entity';
import { RolesEnum, UserModel } from './user.model';
import { UserByOwnerModel } from './user-by-owner';
import { BrokerRefererDTO } from '../broker-referer/broker-referer.dto';

export class UserDTO {
  public static mapTo(param: UserBackendEntity): UserModel {
    return {
      id: param.id,
      name: param.name,
      lastName: param.last_name,
      email: param.email,
      roles: param.roles as RolesEnum[],
      birthday: param.birthday ? new Date(param.birthday) : undefined,
      gender: param.gender ?? undefined,
      emailVerifiedAt: param.email_verified_at
        ? new Date(param.email_verified_at)
        : undefined,
      createdAt: new Date(param.created_at),
      updatedAt: new Date(param.updated_at),
      lastLoginAt: param.last_login_at
        ? new Date(param.last_login_at)
        : undefined,
      archivedAt: param.archived_at ? new Date(param.archived_at) : undefined,
      resetPasswordCode: param.reset_password_code ?? undefined,
      resetPasswordCodeExpiredAt: param.reset_password_code_expired_at
        ? new Date(param.reset_password_code_expired_at)
        : undefined,
      agency: param.agency ?? undefined,
      broker: param.broker ? BrokerDTO.mapTo(param.broker) : undefined,
      insureds: param.insureds,
      account: param.account ?? undefined,
      brokerReferrer: param.broker_referrer
        ? BrokerRefererDTO.mapTo(param.broker_referrer)
        : undefined,
      fullName: param.fullname,
      sessionId: param.session_id,
    };
  }

  public static mapFrom(param: UserModel): UserBackendEntity {
    return {
      id: param.id,
      name: param.name,
      last_name: param.lastName,
      email: param.email,
      roles: param.roles,
      birthday: param.birthday ? param.birthday.toISOString() : undefined,
      gender: param.gender,
      email_verified_at: param.emailVerifiedAt
        ? param.emailVerifiedAt.toISOString()
        : undefined,
      created_at: param.createdAt.toISOString(),
      updated_at: param.updatedAt.toISOString(),
      last_login_at: param.lastLoginAt
        ? param.lastLoginAt.toISOString()
        : undefined,
      archived_at: param.archivedAt
        ? param.archivedAt.toISOString()
        : undefined,
      reset_password_code: param.resetPasswordCode,
      reset_password_code_expired_at: param.resetPasswordCodeExpiredAt
        ? param.resetPasswordCodeExpiredAt.toISOString()
        : undefined,
      agency: param.agency,
      broker: param.broker ? BrokerDTO.mapFrom(param.broker) : undefined,
      insureds: param.insureds,
      account: param.account,
      broker_referrer: param.brokerReferrer
        ? BrokerRefererDTO.mapFrom(param.brokerReferrer)
        : undefined,
      fullname: param.fullName,
      session_id: param.sessionId,
    };
  }

  public static mapFromByOwner(
    param: UserByOwnerModel
  ): UserByOwnerBackendEntity {
    return {
      name: param.name,
      last_name: param.last_name,
      email: param.email,
      phone_number: param.phone_number,
      business_line: param.business_line,
      license_number: param.license_number,
      license_expiry_date: new Date(param.license_expiry_date),
      birthday: new Date(param.birthday),
      gender: param.gender,
      rol: param.rol,
    };
  }
}
