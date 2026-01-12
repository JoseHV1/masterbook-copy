// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { SingupModalComponent } from './sign-up-modal.component';
// import { DialogModule } from 'primeng/dialog';
// import { DropdownModule } from 'primeng/dropdown';
// import { InputModule } from '../form/input/input.module';
// import { ReactiveFormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';
// import { MatIconModule } from '@angular/material/icon';

// @NgModule({
//   declarations: [SingupModalComponent],
//   imports: [
//     CommonModule,
//     DialogModule,
//     InputModule,
//     ReactiveFormsModule,
//     TranslateModule,
//     DropdownModule,
//     MatIconModule,
//   ],
//   exports: [SingupModalComponent],
// })
// export class SingupModalModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingupModalComponent } from './sign-up-modal.component';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputModule } from '../form/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { environment } from 'src/environments/environment';

import {
  RecaptchaModule,
  RecaptchaFormsModule,
  RECAPTCHA_SETTINGS,
  RecaptchaSettings,
} from 'ng-recaptcha';

@NgModule({
  declarations: [SingupModalComponent],
  imports: [
    CommonModule,
    DialogModule,
    InputModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownModule,
    MatIconModule,
    RecaptchaModule,
    RecaptchaFormsModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.RECAPTCHA_SITE_KEY,
      } as RecaptchaSettings,
    },
  ],
  exports: [SingupModalComponent],
})
export class SingupModalModule {}
