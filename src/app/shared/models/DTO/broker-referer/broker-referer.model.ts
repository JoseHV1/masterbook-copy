export interface BrokerRefererModel {
  id: string;
  profileImage?: string;
  phoneNumber: string;
  user: {
    id: string;
    name: string;
    lastName: string;
  };
}
