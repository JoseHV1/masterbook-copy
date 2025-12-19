export interface RequestDetailsModel {
  price: string | number;
  id: string;
  sequentialIdentifier: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  accountId: string;
  brokerName: string;
  requestCustomId: string;
  objectInsurance: string;
  value: number;
  url: string;
  requestType: string;
  location: string;
  deleteAt?: Date;
  application: string;
  additionalInformation: string;
  actionType: string;
  customerRequestLink?: string;
}
