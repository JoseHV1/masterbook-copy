import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortalAdminComponent } from './portal-admin.component';
import { RouterModule, Routes } from '@angular/router';
import { InternalLayoutModule } from '../shared/layouts/internal-layout/internal-layout.module';

const defaultRoute = 'dashboard';
const routes: Routes = [
  {
    path: '',
    component: PortalAdminComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then(
            module => module.DashboardModule
          ),
      },
      {
        path: 'agencies',
        loadChildren: () =>
          import('./agency/agency.module').then(module => module.AgencyModule),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('./reports/reports.module').then(
            module => module.ReportsModule
          ),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('../portal/calendar/calendar.module').then(
            module => module.CalendarModule
          ),
      },
      {
        path: 'communication',
        loadChildren: () =>
          import('../portal/communication/communication.module').then(
            module => module.CommunicationModule
          ),
      },
    ],
  },
  { path: '', redirectTo: defaultRoute, pathMatch: 'full' },
  { path: '**', redirectTo: defaultRoute, pathMatch: 'full' },
];

@NgModule({
  declarations: [PortalAdminComponent],
  imports: [CommonModule, InternalLayoutModule, RouterModule.forChild(routes)],
})
export class PortalAdminModule {}
