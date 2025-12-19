import { DropdownOptionModel } from 'src/app/shared/models/dropdown-option.model';

export const GENDERS: DropdownOptionModel[] = [
  { name: 'Man', code: 'M' },
  { name: 'Woman', code: 'W' },
];

export const MARITAL_STATUS: DropdownOptionModel[] = [
  { name: 'Married', code: 'MR' },
  { name: 'Single', code: 'SG' },
  { name: 'Divorced', code: 'DV' },
];

export const COUNTRIES: DropdownOptionModel[] = [
  { name: 'Puerto Rico', code: 'PR' },
  { name: 'United State', code: 'USA' },
];

export const DRIVERS: DropdownOptionModel[] = [
  { name: 'Commute', code: 'COM' },
  { name: 'Pleasure', code: 'PLE' },
  { name: 'Business', code: 'BUS' },
];

export const COVERAGE_TYPES: DropdownOptionModel[] = [
  { name: 'Civil Liability', code: 'CVL' },
  { name: 'Collision', code: 'CLS' },
  { name: 'Comprehensive', code: 'COM' },
];

export const PAYMENT_METHODS: DropdownOptionModel[] = [
  { name: 'Cards', code: 'C' },
  { name: 'Transfer', code: 'T' },
  { name: 'Wire', code: 'W' },
];

export const FREQUENCIES: DropdownOptionModel[] = [
  { name: 'Monthly', code: 'M' },
];

export const CONSTRUCTION_MATERIAL_TYPES: DropdownOptionModel[] = [
  { name: 'Wood', code: 'w' },
  { name: 'Concrete', code: 'C' },
  { name: 'Cement', code: 'C' },
];

export const ROOFING_MATERIAL_TYPES: DropdownOptionModel[] = [
  { name: 'Wood', code: 'w' },
  { name: 'Metal', code: 'M' },
  { name: 'PVC', code: 'P' },
];

export const FONDATION_HOME_TYPES: DropdownOptionModel[] = [
  { name: 'Wood', code: 'w' },
  { name: 'Concrete', code: 'C' },
  { name: 'Cement', code: 'C' },
];

export const HOME_STYLES_TYPES: DropdownOptionModel[] = [
  { name: 'American Craftsman', code: 'AC' },
  { name: 'Farmhouse', code: 'FH' },
  { name: 'Greek Revival', code: 'GR' },
  { name: 'Colonial Revival Architecture', code: 'CRA' },
  { name: 'Mediterranean Revival Architecture', code: 'MRA' },
  { name: 'Ranch-style Home', code: 'RHH' },
  { name: 'Georgian Architecture', code: 'GA' },
  { name: 'Tudor Architecture', code: 'TA' },
];

export const KITCHEN_COUNTERTOPS_MATERIAL_TYPES: DropdownOptionModel[] = [
  { name: 'Granite', code: 'G' },
  { name: 'Quartz', code: 'Q' },
  { name: 'Concrete', code: 'C' },
  { name: 'Solid Surface', code: 'SS' },
  { name: 'Wood', code: 'W' },
  { name: 'Stainless Steel', code: 'STST' },
  { name: 'Marble', code: 'M' },
  { name: 'Tile', code: 'T' },
  { name: 'Soapstone', code: 'S' },
];
