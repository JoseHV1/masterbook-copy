import { DropdownOptionModel } from '../models/dropdown-option.model';
import { capitalizeFirstLetter } from './capitaliza-first-lettet';

export function enumToDropDown(enumValue: any): DropdownOptionModel[] {
  return Object.entries(enumValue).map(value => {
    if (typeof value[1] === 'string') {
      const name = value[0]
        .split('_')
        .map(frag => capitalizeFirstLetter(frag.toLowerCase()))
        .join(' ');
      return { name, code: value[1] };
    } else {
      throw new Error(`Invalid enum value: ${value[1]}`);
    }
  });
}
