export interface BaseModel {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  _id: string;
}
