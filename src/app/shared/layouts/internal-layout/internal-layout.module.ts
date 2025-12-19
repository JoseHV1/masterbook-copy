import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternalLayoutComponent } from './internal-layout.component';
import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { InternalMenuModule } from './internal-menu/internal-menu.module';
import { InternalNavbarModule } from './internal-navbar/internal-navbar.module';

@NgModule({
  declarations: [InternalLayoutComponent],
  imports: [
    CommonModule,
    InternalMenuModule,
    InternalNavbarModule,
    SidebarModule,
    ButtonModule,
  ],
  exports: [InternalLayoutComponent],
})
export class InternalLayoutModule {}
