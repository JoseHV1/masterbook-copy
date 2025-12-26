import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight',
})
export class WeightPipe implements PipeTransform {
  //recibe bytes y saca megabytes
  transform(value: number): string {
    return (value / (1024 * 1024)).toFixed(2);
  }
}
