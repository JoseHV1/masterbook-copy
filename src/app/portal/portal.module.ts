import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalComponent } from './portal.component';
import { PortalLayoutModule } from '../shared/layouts/portal-layout/portal-layout.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PortalComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            module => module.DashboardModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [PortalComponent],
  imports: [CommonModule, PortalLayoutModule, RouterModule.forChild(routes)],
})
export class PortalModule {}
