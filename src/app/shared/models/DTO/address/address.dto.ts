import { AddressBackendEntity } from './address.back-entity';
import { AddressModel } from './address.model';

export class AddressDTO {
  public static mapTo(param: AddressBackendEntity): AddressModel {
    return {
      latitude: param.latitude,
      longitude: param.longitude,
      additionalAddress: param.additional_address,
      country: param.country,
    };
  }

  public static mapFrom(param: AddressModel): AddressBackendEntity {
    return {
      latitude: param.latitude,
      longitude: param.longitude,
      additional_address: param.additionalAddress,
      country: param.country,
    };
  }
}
