import { HiredBackendEntity } from './hired.back-entity';
import { HiredModel } from './hired.model';

export class HiredDTO {
  public static mapTo(param: HiredBackendEntity): HiredModel {
    return {
      id: param.id,
      name: param.name,
    };
  }

  public static mapFrom(param: HiredModel): HiredBackendEntity {
    return {
      id: param.id,
      name: param.name,
    };
  }
}
