import { ProductModel } from '../../port/models/product.model';
import { ProductBackendEntity } from '../entities/product-backend.entity';
import { CrmPermitBackendDTO } from './crm-permit-backend.dto';

export class ProductBackendDTO {
  public static toDomain(param: ProductBackendEntity): ProductModel {
    return {
      //amount: param.amount,
      crmPermits: param.crm_permits.map(permit =>
        CrmPermitBackendDTO.toDomain(permit)
      ),
      description: param.description,
      id: param.id,
      idStripe: param.id_stripe,
      name: param.name,
      quantity: param.quantity,
      status: param.status,
      timeQuantity: param.time_quantity,
      timeType: param.time_type,
      type: param.type,
      createdAt: param.created_at ? new Date(param.created_at) : undefined,
      updatedAt: param.updated_at ? new Date(param.updated_at) : undefined,
    };
  }
  public static fromDomain(param: ProductModel): ProductBackendEntity {
    return {
      //amount: param.amount,
      crm_permits: param.crmPermits.map(permit =>
        CrmPermitBackendDTO.fromDomain(permit)
      ),
      description: param.description,
      id: param.id,
      id_stripe: param.idStripe,
      name: param.name,
      quantity: param.quantity,
      status: param.status,
      time_quantity: param.timeQuantity,
      time_type: param.timeType,
      type: param.type,
      created_at: param.createdAt ? param.createdAt.toDateString() : undefined,
      updated_at: param.updatedAt ? param.updatedAt.toDateString() : undefined,
    };
  }
}
