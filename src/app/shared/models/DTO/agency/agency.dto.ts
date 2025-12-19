import { AgencyBackendEntity } from './agency.back-entity';
import { AgencyModel } from './agency.model';

export class AgencyDTO {
  public static mapTo(param: AgencyBackendEntity): AgencyModel {
    return {
      id: param.id,
      name: param.name,
      staffSize: param.staff_size,
      createdAt: new Date(param.created_at),
      updatedAt: new Date(param.updated_at),
      owner: param.owner,
      employees: param.employees,
    };
  }

  public static mapFrom(param: AgencyModel): AgencyBackendEntity {
    return {
      id: param.id,
      name: param.name,
      staff_size: param.staffSize,
      created_at: param.createdAt.toDateString(),
      updated_at: param.updatedAt.toDateString(),
      owner: param.owner,
      employees: param.employees,
    };
  }
}
