export interface BusinessLineModel {
  id: string;
  name: string;
  description: string;
  active: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
