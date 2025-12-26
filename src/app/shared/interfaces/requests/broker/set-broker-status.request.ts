import { BrokerStatusEnum } from 'src/app/shared/enums/broker-status.enum';

export interface SetBrokerStatusRequest {
  status: BrokerStatusEnum;
}
