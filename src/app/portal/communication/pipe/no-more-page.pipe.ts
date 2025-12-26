import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noMorePage',
  standalone: true,
  pure: true,
})
export class NoMorePagePipe implements PipeTransform {
  transform(
    tokenHistoryArray: string[],
    tokenHistoryPosition: number
  ): boolean {
    return tokenHistoryArray[tokenHistoryPosition + 1] === 'end';
  }
}
