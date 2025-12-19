import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonLayoutComponent } from './anon-layout.component';
import { AnonNavbarModule } from './anon-navbar/anon-navbar.module';
import { AnonFooterModule } from './anon-footer/anon-footer.module';
import { PrimaryButtonModule } from '../../components/primary-button/primary-button.module';
import { LinkButtonModule } from '../../components/link-button/link-button.module';
import { SecondaryButtonModule } from '../../components/secondary-button/secondary-button.module';

@NgModule({
  declarations: [AnonLayoutComponent],
  imports: [
    CommonModule,
    AnonNavbarModule,
    AnonFooterModule,
    PrimaryButtonModule,
    LinkButtonModule,
    SecondaryButtonModule,
  ],
  exports: [AnonLayoutComponent],
})
export class AnonLayoutModule {}
