export interface HowToModel {
  _id: string;
  serial: string;
  title: string;
  description?: string;
  video: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
