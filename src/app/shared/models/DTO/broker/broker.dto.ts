import { BrokerBackendEntity } from './broker.back-entity';
import { BrokerModel } from './broker.model';
import { AddressDTO } from '../address/address.dto';
import { AgencyDTO } from '../agency/agency.dto';
import { HiredDTO } from '../hired/hired.dto';

export class BrokerDTO {
  public static mapTo(param: BrokerBackendEntity): BrokerModel {
    return {
      id: param.id,
      licenseNumber: param.license_number,
      licenseNumberExpires: param.license_number_expires_on
        ? new Date(param.license_number_expires_on)
        : undefined,
      logo: param.logo,
      profileImage: param.profile_image,
      checkBrandPublication: param.check_brand_publication,
      phoneNumber: param.phone_number,
      address: param.address,
      addressExtra: param.address_extra
        ? AddressDTO.mapTo(param.address_extra)
        : undefined,
      position: param.position,
      createdAt: new Date(param.created_at),
      updatedAt: new Date(param.updated_at),
      businessLines: param.business_lines_ids,
      user: param.user,
      agency: param.agency ? AgencyDTO.mapTo(param.agency) : undefined,
      hired: param.hired,
    };
  }

  public static mapFrom(param: BrokerModel): BrokerBackendEntity {
    return {
      id: param.id,
      license_number: param.licenseNumber,
      license_number_expires_on: param.licenseNumberExpires
        ? param.licenseNumberExpires.toISOString()
        : undefined,
      logo: param.logo,
      profile_image: param.profileImage,
      check_brand_publication: param.checkBrandPublication,
      phone_number: param.phoneNumber,
      address: param.address,
      address_extra: param.addressExtra
        ? AddressDTO.mapFrom(param.addressExtra)
        : undefined,
      position: param.position,
      created_at: param.createdAt.toISOString(),
      updated_at: param.updatedAt.toISOString(),
      business_lines_ids: param.businessLines,
      user: param.user,
      agency: param.agency ? AgencyDTO.mapFrom(param.agency) : undefined,
      hired: param.hired,
    };
  }
}
