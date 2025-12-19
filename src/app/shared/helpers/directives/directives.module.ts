import { NgModule } from '@angular/core';
import { NoCopyDirective } from './non-copy-directive.helper';

@NgModule({
  declarations: [NoCopyDirective],
  exports: [NoCopyDirective],
})
export class DirectivesModule {}
