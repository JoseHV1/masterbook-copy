import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'business-lines', pathMatch: 'full' },
  {
    path: 'business-lines',
    loadChildren: () =>
      import('./business-lines/business-lines.module').then(
        module => module.BusinessLinesModule
      ),
  },
  {
    path: 'policy-categories',
    loadChildren: () =>
      import('./policy-categories/policy-categories.module').then(
        module => module.PolicyCategoriesModule
      ),
  },
  {
    path: 'policy-types',
    loadChildren: () =>
      import('./policy-types/policy-types.module').then(
        module => module.PolicyTypesModule
      ),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PolicySettingsModule {}
