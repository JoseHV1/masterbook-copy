export interface AddressExtra {
  latitude: number;
  longitude: number;
  additionalAddress: string;
}

export interface Agency {
  id: string;
  name: string;
  staffSize: string;
  createdAt: string;
  updatedAt: string;
  owner: string;
  employees: string[];
}

export interface Broker {
  id: string;
  licenseNumber: string;
  licenseNumberExpires: string;
  logo: string | null;
  profileImage: string | null;
  checkBrandPublication: boolean;
  phoneNumber: string;
  address: string;
  addressExtra: AddressExtra;
  position: string;
  createdAt: string;
  updatedAt: string;
  businessLines: string[];
  user: string; // why do i need this?
  agency: Agency;
  hired: string | null;
}

export interface UserAgentModel {
  profileImage: any;
  id: string;
  name: string;
  lastName: string;
  email: string;
  roles: string[];
  emailVerifiedAt: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string;
  broker?: Broker;
  insureds: any[];
  fullName: string;
}
