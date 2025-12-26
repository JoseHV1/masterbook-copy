import {
  RequestTypeModel,
  RequestTypes,
  RequestSubTypeModel,
  RequestSubTypes,
} from 'src/app/shared/models/request-type.model';

export const REQUEST_TYPE_DATASET: RequestTypeModel[] = [
  {
    type: RequestTypes.VEHICLE,
    icon: '/assets/icons/portal-client/car.svg',
    iconSelected: '/assets/icons/portal-client/cart-selected.svg',
  },
  {
    type: RequestTypes.ACCIDENT,
    icon: '/assets/icons/portal-client/accident.svg',
    iconSelected: '/assets/icons/portal-client/accident-selected.svg',
  },
  {
    type: RequestTypes.UMBRELLA,
    icon: '/assets/icons/portal-client/umbrella.svg',
    iconSelected: '/assets/icons/portal-client/umbrella-selected.svg',
  },
  {
    type: RequestTypes.PROPERTY,
    icon: '/assets/icons/portal-client/property.svg',
    iconSelected: '/assets/icons/portal-client/property-selected.svg',
  },
  {
    type: RequestTypes.TRIP,
    icon: '/assets/icons/portal-client/travel.svg',
    iconSelected: '/assets/icons/portal-client/trip-selected.svg',
  },
  {
    type: RequestTypes.LIFE,
    icon: '/assets/icons/portal-client/life.svg',
    iconSelected: '/assets/icons/portal-client/life-selected.svg',
  },
  {
    type: RequestTypes.HEALTH,
    icon: '/assets/icons/portal-client/health.svg',
    iconSelected: '/assets/icons/portal-client/health-selected.svg',
  },
  {
    type: RequestTypes.MORE,
    icon: '/assets/icons/portal-client/more.svg',
    iconSelected: '/assets/icons/portal-client/more-selected.svg',
  },
];

export const REQUEST_SUBTYPE_DATASET: RequestSubTypeModel[] = [
  {
    value: RequestSubTypes.PERSONAL,
  },
  {
    value: RequestSubTypes.COMERCIAL,
  },
];
