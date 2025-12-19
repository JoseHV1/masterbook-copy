import { PolicyBackendEntity } from './policy.back-entity';
import { PolicyModel } from './policy.model';

export class PolicyDTO {
  public static mapTo(param: PolicyBackendEntity): PolicyModel {
    return {
      accountId: param.account_id,
      actionType: param.action_type,
      coverage: param.coverage,
      deductible: param.deductible,
      details: param.details,
      efectiveDate: param.efective_date,
      expirationDate: param.expiration_date,
      insuranceCompany: param.insurance_company,
      pending: param.pending,
      policyCopy: param.policy_copy,
      policyNumber: param.policy_number,
      policyPrime: param.policy_prime,
      renewalDocument: param.renewal_document,
      requestForm: param.request_form,
      requestId:
        param.request_id && param.request_id !== 'None'
          ? param.request_id
          : undefined,
      status: param.status,
    };
  }

  public static mapFrom(param: PolicyModel): PolicyBackendEntity {
    return {
      account_id: param.accountId,
      action_type: param.actionType,
      coverage: param.coverage,
      deductible: param.deductible,
      details: param.details,
      efective_date: param.efectiveDate,
      expiration_date: param.expirationDate,
      insurance_company: param.insuranceCompany,
      pending: param.pending,
      policy_copy: param.policyCopy,
      policy_number: param.policyNumber,
      policy_prime: param.policyPrime,
      renewal_document: param.renewalDocument,
      request_form: param.requestForm,
      request_id: param.requestId ?? undefined,
      status: param.status,
    };
  }
}
