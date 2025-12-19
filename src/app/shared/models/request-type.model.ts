export interface RequestTypeModel {
  type: RequestTypes;
  icon: string;
  iconSelected: string;
}

export enum RequestTypes {
  VEHICLE = 'car',
  ACCIDENT = 'accident',
  UMBRELLA = 'umbrella',
  PROPERTY = 'property',
  TRIP = 'trip',
  LIFE = 'life',
  HEALTH = 'health',
  MORE = 'more',
}

export interface RequestSubTypeModel {
  value: RequestSubTypes;
}

export enum RequestSubTypes {
  PERSONAL = 'Personal',
  COMERCIAL = 'Comercial',
}
