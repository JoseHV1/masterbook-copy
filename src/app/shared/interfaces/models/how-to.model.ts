export interface HowToModel {
  _id: string;
  serial: string;
  title: string;
  description?: string;
  video: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
