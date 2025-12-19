import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnonComponent } from './anon.component';
import { AnonLayoutModule } from '../shared/layouts/anon-layout/anon-layout.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AnonComponent,
    children: [
      {
        path: 'agents',
        loadChildren: () =>
          import('./home/home.module').then(module => module.HomeModule),
      },
      {
        path: 'clients',
        loadChildren: () =>
          import('./home-client/home-client.module').then(
            module => module.HomeClientModule
          ),
      },
      {
        path: 'activate-user',
        loadChildren: () =>
          import('./email-verify/email-verify.module').then(
            module => module.EmailVerifyModule
          ),
      },
      {
        path: 'privacy',
        loadChildren: () =>
          import('./privacy-policy/privacy-policy.module').then(
            module => module.PrivacyPolicyModule
          ),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('./reset-password/reset-password.module').then(
            module => module.ResetPasswordModule
          ),
      },
      {
        path: 'terms-conditions',
        loadChildren: () =>
          import('./terms-conditions/terms-conditions.module').then(
            module => module.TermsConditionsModule
          ),
      },
      {
        path: 'unathorized',
        loadChildren: () =>
          import('./unauthorized/unathorized.module').then(
            module => module.UnauthorizedModule
          ),
      },
      { path: '**', redirectTo: 'agents', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  declarations: [AnonComponent],
  imports: [CommonModule, AnonLayoutModule, RouterModule.forChild(routes)],
})
export class AnonModule {}
