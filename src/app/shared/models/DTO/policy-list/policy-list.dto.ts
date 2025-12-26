import { PolicyListBackendEntity } from './policy-list.back-entity';
import { PolicyListModel } from './policy-list.model';

export class PolicyListDTO {
  public static mapTo(param: PolicyListBackendEntity): PolicyListModel {
    return {
      coverage: param.coverage,
      deductible: param.deductible,
      details: param.details,
      pending: param.pending,
      status: param.status,
      account: param.account,
      created_at: new Date(param.created_at ?? null),
      efective_date: new Date(param.efective_date ?? null),
      expiration_date: new Date(param.expiration_date ?? null),
      updated_at: new Date(param.updated_at ?? null),
      id: param.id,
      insurance_company: param.insurance_company,
      invoice: param.invoice,
      policy_copy: param.policy_copy,
      policy_number: param.policy_number,
      policy_prime: param.policy_prime,
      renewal_document: param.renewal_document,
      request_form: param.request_form,
      request_id: param.request_id,
      version_number: param.version_number,
    };
  }

  public static mapFrom(param: PolicyListModel): PolicyListBackendEntity {
    return {
      coverage: param.coverage,
      deductible: param.deductible,
      details: param.details,
      pending: param.pending,
      status: param.status,
      account: param.account,
      created_at: param.created_at ? param.created_at.toISOString() : '',
      efective_date: param.efective_date
        ? param.efective_date.toISOString()
        : '',
      expiration_date: param.expiration_date
        ? param.expiration_date.toISOString()
        : '',
      updated_at: param.updated_at ? param.updated_at.toISOString() : '',
      id: param.id,
      insurance_company: param.insurance_company,
      invoice: param.invoice,
      policy_copy: param.policy_copy,
      policy_number: param.policy_number,
      policy_prime: param.policy_prime,
      renewal_document: param.renewal_document,
      request_form: param.request_form,
      request_id: param.request_id,
      version_number: param.version_number,
    };
  }
}
