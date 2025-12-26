import { UserDTO } from '../user/user.dto';
import { EmployeeBackEntity } from './employee.back-entity';
import { EmployeeModel } from './employee.model';

export class EmployeeDTO {
  public static mapTo(param: EmployeeBackEntity): EmployeeModel {
    return {
      id: param.id,
      license_number: param.license_number,
      license_number_expires_on: param.license_number_expires_on,
      logo: param.logo,
      profile_image: param.profile_image,
      check_brand_publication: param.check_brand_publication,
      phone_number: param.phone_number,
      address: param.address,
      address_extra: param.address_extra,
      position: param.position,
      created_at: param.created_at,
      updated_at: param.updated_at,
      business_lines_ids: param.business_lines_ids,
      user: {
        id: param.user.id,
        name: param.user.name,
        last_name: param.user.last_name,
        email: param.user.email,
        roles: param.user.roles,
        email_verified_at: param.user.email_verified_at,
        created_at: param.user.created_at,
        updated_at: param.user.updated_at,
        archived_at: param.user.archived_at,
        gender: param.user.gender,
        birthday: param.user.birthday,
        fullname: param.user.fullname,
      },
      agency: param.agency,
      hired: param.hired,
    };
  }

  public static mapFrom(param: EmployeeModel): EmployeeBackEntity {
    return {
      id: param.id,
      license_number: param.license_number,
      license_number_expires_on: param.license_number_expires_on,
      logo: param.logo,
      profile_image: param.profile_image,
      check_brand_publication: param.check_brand_publication,
      phone_number: param.phone_number,
      address: param.address,
      address_extra: param.address_extra,
      position: param.position,
      created_at: param.created_at,
      updated_at: param.updated_at,
      business_lines_ids: param.business_lines_ids,
      user: {
        id: param.user.id,
        name: param.user.name,
        last_name: param.user.last_name,
        email: param.user.email,
        roles: param.user.roles,
        email_verified_at: param.user.email_verified_at,
        created_at: param.user.created_at,
        updated_at: param.user.updated_at,
        archived_at: param.user.archived_at,
        gender: param.user.gender,
        birthday: param.user.birthday,
        fullname: param.user.fullname,
      },
      agency: param.agency,
      hired: param.hired,
    };
  }
}
