import { InsuranceCompanyModel } from './insurance-company.model';
import { InsuranceCompanyBackendEntity } from './insurance-company.back-entity';

export class InsuranceCompanyDTO {
  public static mapTo(
    params: InsuranceCompanyBackendEntity
  ): InsuranceCompanyModel {
    return {
      id: params.id,
      insurerCustomName: params.insurer_custom_name,
      name: params.name,
      email: params.email,
      phones: params.phones,
      fax: params.fax,
      direction: params.direction,
      status: params.status,
      businessLine: params.business_line,
      createdAt: new Date(params.created_at),
      updatedAt: new Date(params.updated_at),
    };
  }
  public static mapFrom(
    params: InsuranceCompanyModel
  ): InsuranceCompanyBackendEntity {
    return {
      id: params.id,
      insurer_custom_name: params.insurerCustomName,
      name: params.name,
      email: params.email,
      phones: params.phones,
      fax: params.fax,
      direction: params.direction,
      status: params.status,
      business_line: params.businessLine,
      created_at: params.createdAt.toISOString(),
      updated_at: params.updatedAt.toDateString(),
    };
  }
}
