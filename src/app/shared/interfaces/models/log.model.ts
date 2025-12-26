import { BaseModel } from './base.model';

export interface LogModel extends BaseModel {
  field: string;
  oldValue: any;
  newValue: any;
  changedBy: string;
  changeDate: string;
  changeType: 'Register' | 'Edit';
}
