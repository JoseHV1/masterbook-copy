export interface DynamicForm {
  name: string;
  description: string;
  businessLine: string;
  form: FormDynamicCore[];
}

export interface DynamicFormResponse {
  id: string;
  name: string;
  description: string;
  businessLine: string;
  form: FormDynamicCore[];
  businessLineName: string;
}

//for sending data to backend
export interface DynamicFormRequest {
  id: string;
  name: string;
  description: string;
  businessLine: string;
  form: FormDynamicCore[];
  isActive: boolean;
}

export interface FormDynamicCore {
  type:
    | 'text'
    | 'number'
    | 'textArea'
    | 'switch'
    | 'knob'
    | 'multiselect'
    | 'date'
    | 'dateInline'
    | 'upload';
  label: string;
  size: { value: '3' | '6' | '12'; label: 'Pequeño' | 'Mediano' | 'Grande' };
}

export const inputTypeAvailable: Options[] = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'textArea', label: 'Text area' },
  { value: 'switch', label: 'Switch' },
  { value: 'knob', label: 'Knob' },
  { value: 'multiselect', label: 'Multiselect' },
  { value: 'date', label: 'Date' },
  { value: 'dateInline', label: 'Date inline' },
  { value: 'upload', label: 'Upload' },
];

export const businessLines: Options[] = [
  { value: '1', label: 'Propiedad y contingencia' },
];

export const sizeAvailable: Options[] = [
  { value: '3', label: 'Pequeño' },
  { value: '6', label: 'Mediano' },
  { value: '12', label: 'Grande' },
];

export interface Options {
  value: string;
  label: string;
}
