export interface AgencyModel {
  id: string;
  name: string;
  staffSize: string;
  createdAt: Date;
  updatedAt: Date;
  owner: string;
  employees: string[];
}
