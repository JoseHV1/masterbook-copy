import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminTenantsComponent } from './tenants.component';

const routes: Routes = [
  {
    path: '',
    component: AdminTenantsComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./tenants-list/tenants-list.module').then(
            m => m.TenantsListModule
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./new-tenant/new-tenant.module').then(
            m => m.NewTenantModule
          ),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./tenant-detail/tenant-detail.module').then(
        m => m.TenantDetailModule
      ),
  },
  {
    path: ':serial/edit',
    loadChildren: () =>
      import('./edit-tenant/edit-tenant.module').then(
        m => m.EditTenantModule
      ),
  },
];

@NgModule({
  declarations: [AdminTenantsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class TenantsModule {}
