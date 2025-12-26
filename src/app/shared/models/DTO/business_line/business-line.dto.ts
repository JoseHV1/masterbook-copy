import { BusinessLineBackendEntity } from './business-line.back-entity';
import { BusinessLineModel } from './business-line.model';

export class BusinessLineDTO {
  public static mapTo(param: BusinessLineBackendEntity): BusinessLineModel {
    return {
      active: param.active,
      createdAt: new Date(param.created_at),
      description: param.description,
      id: param.id,
      name: param.name,
      updatedAt: new Date(param.updated_at),
      image: param.image ?? undefined,
    };
  }
  public static mapFrom(param: BusinessLineModel): BusinessLineBackendEntity {
    return {
      active: param.active,
      created_at: param.createdAt.toISOString(),
      description: param.description,
      id: param.id,
      name: param.name,
      updated_at: param.updatedAt.toISOString(),
      image: param.image,
    };
  }
}
