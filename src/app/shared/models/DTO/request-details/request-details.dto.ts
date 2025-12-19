import { RequestDetailsBackendEntity } from './request-details.back-entity';
import { RequestDetailsModel } from './request-details.model';

export class RequestDetailsDTO {
  public static mapTo(param: RequestDetailsBackendEntity): RequestDetailsModel {
    return {
      id: param.id,
      sequentialIdentifier: param.sequential_identifier,
      status: param.status,
      createdAt: new Date(param.created_at),
      updatedAt: new Date(param.updated_at),
      price: param.price,
      accountId: param.account_id,
      brokerName: param.broker_id,
      requestCustomId: param.request_custom_id,
      objectInsurance: param.object_of_insurance,
      value: param.value,
      url: param.url,
      requestType: param.request_type,
      location: param.location,
      deleteAt: param.delete_at ? new Date(param.delete_at) : undefined,
      application: param.application,
      additionalInformation: param.additional_information,
      actionType: param.action_type,
      customerRequestLink: param.customer_request_link,
    };
  }

  public static mapFrom(
    param: RequestDetailsModel
  ): RequestDetailsBackendEntity {
    return {
      id: param.id,
      price: param.price,
      sequential_identifier: param.sequentialIdentifier,
      status: param.status,
      created_at: param.createdAt.toISOString(),
      updated_at: param.updatedAt.toISOString(),
      account_id: param.accountId,
      broker_id: param.brokerName,
      request_custom_id: param.requestCustomId,
      object_of_insurance: param.objectInsurance,
      value: param.value,
      url: param.url,
      request_type: param.requestType,
      location: param.location,
      delete_at: param.deleteAt ? param.deleteAt.toISOString() : undefined,
      application: param.application,
      additional_information: param.additionalInformation,
      action_type: param.actionType,
      customer_request_link: param.customerRequestLink,
    };
  }
}
