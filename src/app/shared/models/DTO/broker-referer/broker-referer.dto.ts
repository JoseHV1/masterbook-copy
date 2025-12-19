import { BrokerRefererBackEntity } from './broker-referer.back-entity';
import { BrokerRefererModel } from './broker-referer.model';

export class BrokerRefererDTO {
  public static mapTo(param: BrokerRefererBackEntity): BrokerRefererModel {
    return {
      id: param.id,
      phoneNumber: param.phone_number,
      profileImage: param.profile_image,
      user: {
        id: param.user.id,
        lastName: param.user.last_name,
        name: param.user.name,
      },
    };
  }

  public static mapFrom(param: BrokerRefererModel): BrokerRefererBackEntity {
    return {
      id: param.id,
      phone_number: param.phoneNumber,
      profile_image: param.profileImage,
      user: {
        id: param.user.id,
        last_name: param.user.lastName,
        name: param.user.name,
      },
    };
  }
}
