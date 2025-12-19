import { Observable } from 'rxjs';
import { FilterTypeEnum } from '../enums/filter-type.enum';

export interface FilterModel {
  type: FilterTypeEnum;
  label: string;
  name: string;
  options?: Observable<{ name: string; code: string }[]>;
}

export interface FilterWrapperModel {
  filters: FilterModel[];
}

export interface FilterResults {
  results: Record<string, string>;
}

export interface FilterActive {
  label: string; //para mostrar al user
  text: string; //para mostrar al user
  name: string; //para enviar al back
  value: any; //para enviar al back
}
