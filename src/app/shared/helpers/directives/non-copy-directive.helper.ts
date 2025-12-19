import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoCopy]',
})
export class NoCopyDirective {
  @HostListener('copy', ['$event'])
  onCopy(event: ClipboardEvent) {
    event.preventDefault();
    return false;
  }
}
