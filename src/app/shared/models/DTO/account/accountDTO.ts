import {
  AccountsModel,
  BrokerDetailsModel,
  UserDetailsModel,
} from './accounts.model';
import {
  AccountsBackendEntity,
  BrokerDetailsBackEntity,
  UserDetailsBackEntity,
} from './accounts.back-entity';

export class AccountDTO {
  public static mapTop(params: AccountsBackendEntity): AccountsModel {
    return {
      id: params.id,
      account_custom_id: params.account_custom_id,
      account_name: params.account_name,
      additional_address_information: params.additional_address_information,
      address: params.address,
      agency_id: params.agency_id,
      birth_date: params.birth_date,
      broker: BrokerDetailsDTO.mapTop(params.broker),
      email: params.email,
      extension: Number(params.extension),
      first_name: params.first_name,
      gender: params.gender,
      identification_number: Number(params.identification_number),
      last_name: params.last_name,
      marital_status: params.marital_status,
      phone: params.phone,
      status: params.status,
      zip_code: Number(params.zip_code),
      created_at: new Date(params.created_at),
      updated_at: new Date(params.updated_at),
    };
  }
  public static mapFrom(params: AccountsModel): AccountsBackendEntity {
    return {
      id: params.id,
      account_custom_id: params.account_custom_id,
      account_name: params.account_name,
      activate_user: false,
      additional_address_information: params.additional_address_information,
      address: params.address,
      agency_id: params.agency_id,
      birth_date: params.birth_date,
      broker: BrokerDetailsDTO.mapFrom(params.broker),
      email: params.email,
      extension: params.extension,
      first_name: params.first_name,
      gender: params.gender,
      identification_number: params.identification_number,
      last_name: params.last_name,
      marital_status: params.marital_status,
      phone: params.phone,
      status: params.status,
      zip_code: params.zip_code,
      created_at: params.created_at,
      updated_at: params.updated_at,
    };
  }
}

export class BrokerDetailsDTO {
  public static mapTop(params: BrokerDetailsBackEntity): BrokerDetailsModel {
    return {
      id: params.id,
      profile_image: params.profile_image,
      phone_number: params.phone_number,
      user: UserDetailsDTO.mapTop(params.user),
    };
  }
  public static mapFrom(params: BrokerDetailsModel): BrokerDetailsBackEntity {
    return {
      id: params.id,
      profile_image: params.profile_image,
      phone_number: params.phone_number,
      user: UserDetailsDTO.mapFrom(params.user),
    };
  }
}

export class UserDetailsDTO {
  public static mapTop(params: UserDetailsBackEntity): UserDetailsModel {
    return {
      id: params.id,
      fullname: params.fullname,
    };
  }
  public static mapFrom(params: UserDetailsModel): UserDetailsBackEntity {
    return {
      id: params.id,
      fullname: params.fullname,
    };
  }
}
