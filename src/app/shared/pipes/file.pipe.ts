import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeFirstLetter } from '../helpers/capitaliza-first-lettet';
import { FileInfoModel } from '../interfaces/models/file-info.model';

@Pipe({
  name: 'customFile',
})
export class FilePipe implements PipeTransform {
  transform(value: string | FileInfoModel): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return 'Document.pdf';
    }
    return `${value.name}.${value.extension}`;
  }
}
