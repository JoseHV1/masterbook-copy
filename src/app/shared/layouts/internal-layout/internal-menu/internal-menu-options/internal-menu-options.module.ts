import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalMenuOptionsComponent } from './internal-menu-options.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [InternalMenuOptionsComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [InternalMenuOptionsComponent],
})
export class InternalMenuOptionsModule {}
