import { NotificationStatusEnum } from '../../enums/notification-status.enum';

export interface NotificationModel {
  id: string;
  title: string;
  description: string;
  serial: string;
  status: NotificationStatusEnum;
  redirectTo: string;
  receiver_id: string;
  createdAt: string;
  updatedAt?: string;
}
