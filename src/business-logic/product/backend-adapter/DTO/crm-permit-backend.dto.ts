import { CrmPermitModel } from '../../port/models/crm-permit.model';
import { CrmPermitBackendEntity } from '../entities/crm-permit-backend.entity';

export class CrmPermitBackendDTO {
  public static toDomain(param: CrmPermitBackendEntity): CrmPermitModel {
    return {
      createdAt: param.created_at ? new Date(param.created_at) : undefined,
      id: param.id,
      name: param.name,
      status: param.status,
      updatedAt: param.updated_at ? new Date(param.updated_at) : undefined,
    };
  }
  public static fromDomain(param: CrmPermitModel): CrmPermitBackendEntity {
    return {
      created_at: param.createdAt ? param.createdAt.toDateString() : undefined,
      id: param.id,
      name: param.name,
      status: param.status,
      updated_at: param.updatedAt ? param.updatedAt.toDateString() : undefined,
    };
  }
}
