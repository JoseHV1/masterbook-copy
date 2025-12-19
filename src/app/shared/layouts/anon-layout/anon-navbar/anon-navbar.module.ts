import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonNavbarComponent } from './anon-navbar.component';
import { LanguageSelectorModule } from '../../../components/language-selector/language-selector.module';
import { TranslateModule } from '@ngx-translate/core';
import { LoginModalModule } from '../../../components/login-modal/login-modal.module';
import { SingupModalModule } from '../../../components/sign-up-modal/sign-up-modal.module';
import { ForgotPasswordModalModule } from '../../../components/forgot-password-modal/forgot-password-modal.module';
import { AnonModalNotificationModule } from '../../../components/anon-modal-notification/anon-modal-notification.module';
import { AnonModalModule } from '../../../components/anon-modal/anon-modal.module';

@NgModule({
  declarations: [AnonNavbarComponent],
  imports: [
    CommonModule,
    LanguageSelectorModule,
    TranslateModule,
    LoginModalModule,
    SingupModalModule,
    ForgotPasswordModalModule,
    AnonModalNotificationModule,
    AnonModalModule,
  ],
  exports: [AnonNavbarComponent],
})
export class AnonNavbarModule {}
