export interface BrokerRefererBackEntity {
  id: string;
  profile_image?: string;
  phone_number: string;
  user: {
    id: string;
    name: string;
    last_name: string;
  };
}
