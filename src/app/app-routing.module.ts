import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/guards/auth.guard';
import { AnonGuard } from './shared/guards/anon.guard';
import { AgentGuard } from './shared/guards/agent.guard';
import { InsuredGuard } from './shared/guards/insured.guard';
import { WelcomeGuard } from './shared/guards/welcome.guard';
import { WelcomeInsuredGuard } from './shared/guards/welcome-insured.guard';
import { WelcomeAgencyBrokerAdminGuard } from './shared/guards/welcome-agency-broker-admin.guard';
import { AdminGuard } from './shared/guards/admin.guard';

const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () =>
      import('./portal/portal.module').then(module => module.PortalModule),
    canActivate: [AuthGuard, AgentGuard],
  },
  {
    path: 'portal-client',
    loadChildren: () =>
      import('./portal-client/portal-client.module').then(
        module => module.PortalClientModule
      ),
    canActivate: [AuthGuard, InsuredGuard],
  },
  {
    path: 'portal-admin',
    loadChildren: () =>
      import('./portal-admin/portal-admin.module').then(
        module => module.PortalAdminModule
      ),
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./register-two/register-two.module').then(
        module => module.RegisterTwoModule
      ),
    canActivate: [AuthGuard, WelcomeGuard],
  },
  {
    path: 'welcome-insured',
    loadChildren: () =>
      import('./register-two-insured/register-two.module').then(
        module => module.RegisterTwoModule
      ),
    canActivate: [AuthGuard, WelcomeInsuredGuard],
  },
  {
    path: 'welcome-agency-broker-admin',
    loadChildren: () =>
      import('./register-two-agency-broker-admin/register-two.module').then(
        module => module.RegisterTwoModule
      ),
    canActivate: [AuthGuard, WelcomeAgencyBrokerAdminGuard],
  },
  {
    path: '',
    loadChildren: () =>
      import('./anon/anon.module').then(module => module.AnonModule),
    canActivate: [AnonGuard],
  },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
