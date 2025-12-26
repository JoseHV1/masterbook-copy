import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'portal',
    loadChildren: () =>
      import('./portal/portal.module').then(module => module.PortalModule),
    //canActivate: [AuthGuard]
  },
  {
    path: '',
    loadChildren: () =>
      import('./anon/anon.module').then(module => module.AnonModule),
    //canActivate: [AnonGuard]
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
