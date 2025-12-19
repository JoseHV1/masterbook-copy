import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalMenuOptionsComponent } from './internal-menu-options.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [InternalMenuOptionsComponent],
  imports: [CommonModule, RouterModule],
  exports: [InternalMenuOptionsComponent],
})
export class InternalMenuOptionsModule {}
