import { RolesEnum } from '../enums/roles.enum';

export const brokersAdminDataset = [
  RolesEnum.AGENCY_OWNER,
  RolesEnum.AGENCY_ADMINISTRATOR,
];

export const brokersNotAdminDataset = [
  RolesEnum.INDEPENDANT_BROKER,
  RolesEnum.AGENCY_BROKER,
];

export const brokerRolesDataset = [
  ...brokersAdminDataset,
  ...brokersNotAdminDataset,
  RolesEnum.PREREGISTER_USER,
];

export const welcomeRolesDataset = [
  RolesEnum.PREREGISTER_USER,
  RolesEnum.AGENCY_OWNER,
  RolesEnum.INDEPENDANT_BROKER,
];

export const welcomeRolesAgencyDataset = [
  RolesEnum.AGENCY_BROKER,
  RolesEnum.AGENCY_ADMINISTRATOR,
];

export const ownersRolesDataset = [
  RolesEnum.AGENCY_OWNER,
  RolesEnum.INDEPENDANT_BROKER,
];

export const NotPreregisterRoles = [...brokerRolesDataset, RolesEnum.INSURED];
