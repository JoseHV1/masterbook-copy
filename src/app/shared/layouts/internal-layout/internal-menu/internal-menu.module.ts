import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalMenuComponent } from './internal-menu.component';
import { InternalMenuOptionsModule } from './internal-menu-options/internal-menu-options.module';

@NgModule({
  declarations: [InternalMenuComponent],
  imports: [CommonModule, InternalMenuOptionsModule],
  exports: [InternalMenuComponent],
})
export class InternalMenuModule {}
