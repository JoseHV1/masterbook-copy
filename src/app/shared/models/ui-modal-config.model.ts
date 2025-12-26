import { UiModalTypeEnum } from '../enums/ui-modal-type.enum';

export interface UiModalConfig {
  title: string;
  text: string;
  type: UiModalTypeEnum;
  link?: { name: string; url: string[] };
  additionalButton?: boolean;
}
