import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonNavbarComponent } from './anon-navbar.component';
import { PrimaryButtonModule } from '../primary-button/primary-button.module';
import { LinkButtonModule } from '../link-button/link-button.module';
import { LanguageSelectorModule } from '../language-selector/language-selector.module';
import { TranslateModule } from '@ngx-translate/core';
import { SecondaryButtonModule } from '../secondary-button/secondary-button.module';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ReactiveFormsModule } from '@angular/forms';
import { AnonModalLoginModule } from '../../components/anon-modal-login/anon-modal-login.module';
import { AnonModalSingupModule } from '../../components/anon-modal-singup/anon-modal-singup.module';
import { AnonModalForgotPasswordModule } from '../../components/anon-modal-forgot-password/anon-modal-forgot-password.module';
import { AnonModalNotificationModule } from '../../components/anon-modal-notification/anon-modal-notification.module';
import { AnonModalModule } from '../../components/anon-modal/anon-modal.module';

@NgModule({
  declarations: [AnonNavbarComponent],
  imports: [
    CommonModule,
    PrimaryButtonModule,
    LinkButtonModule,
    LanguageSelectorModule,
    TranslateModule,
    SecondaryButtonModule,
    DialogModule,
    DropdownModule,
    ReactiveFormsModule,
    AnonModalLoginModule,
    AnonModalSingupModule,
    AnonModalForgotPasswordModule,
    AnonModalNotificationModule,
    AnonModalModule,
  ],
  exports: [AnonNavbarComponent],
})
export class AnonNavbarModule {}
