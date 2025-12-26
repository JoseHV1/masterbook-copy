import { QuotesBackendEntity } from './quotes.back-entity';
import { QuotesModel } from './quotes.model';

export class QuotesDTO {
  public static mapTo(param: QuotesBackendEntity): QuotesModel {
    return {
      id: param.id,
      insuranceType: param.insurance_type,
      createdAt: new Date(param.created_at),
      updatedAt: new Date(param.updated_at),
      policyPrime: param.policy_prime,
      coverageAmount: param.coverage_amount,
      deductible: param.deductible,
      url: param.url,
      status: param.status,
      requestId: param.request_id ?? undefined,
      dateQuote: param.date_of_quotes
        ? new Date(param.date_of_quotes)
        : undefined,
      account: param.account
        ? {
            id: param.account.id,
            firstName: param.account.first_name,
            lastName: param.account.last_name,
          }
        : undefined,
    };
  }

  public static mapFrom(param: QuotesModel): QuotesBackendEntity {
    return {
      id: param.id,
      insurance_type: param.insuranceType,
      created_at: param.createdAt.toDateString(),
      updated_at: param.updatedAt.toDateString(),
      policy_prime: param.policyPrime,
      coverage_amount: param.coverageAmount,
      deductible: param.deductible,
      url: param.url,
      status: param.status,
      request_id: param.requestId ?? undefined,
      date_of_quotes: param.dateQuote
        ? param.dateQuote.toDateString()
        : undefined,
      account: param.account
        ? {
            id: param.account.id,
            first_name: param.account.firstName,
            last_name: param.account.lastName,
          }
        : undefined,
    };
  }
}
