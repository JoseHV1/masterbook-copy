import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPolicyTypesComponent } from './policy-types.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPolicyTypesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./policy-types-list/policy-types-list.module').then(
            m => m.PolicyTypesListModule,
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./new-policy-type/new-policy-type.module').then(
            m => m.NewPolicyTypeModule,
          ),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./policy-type-detail/policy-type-detail.module').then(
        m => m.PolicyTypeDetailModule,
      ),
  },
  {
    path: ':serial/edit',
    loadChildren: () =>
      import('./edit-policy-type/edit-policy-type.module').then(
        m => m.EditPolicyTypeModule,
      ),
  },
];

@NgModule({
  declarations: [AdminPolicyTypesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PolicyTypesModule {}
