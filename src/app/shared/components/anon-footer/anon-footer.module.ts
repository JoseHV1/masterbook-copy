import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonFooterComponent } from './anon-footer.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AnonFooterComponent],
  imports: [CommonModule, TranslateModule],
  exports: [AnonFooterComponent],
})
export class AnonFooterModule {}
