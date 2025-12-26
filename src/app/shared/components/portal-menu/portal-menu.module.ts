import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalMenuComponent } from './portal-menu.component';
import { PortalMenuOptionsModule } from '../portal-menu-options/portal-menu-options.module';

@NgModule({
  declarations: [PortalMenuComponent],
  imports: [CommonModule, PortalMenuOptionsModule],
  exports: [PortalMenuComponent],
})
export class PortalMenuModule {}
