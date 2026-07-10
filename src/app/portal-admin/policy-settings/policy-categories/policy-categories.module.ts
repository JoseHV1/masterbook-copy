import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminPolicyCategoriesComponent } from './policy-categories.component';

const routes: Routes = [
  {
    path: '',
    component: AdminPolicyCategoriesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./policy-categories-list/policy-categories-list.module').then(
            m => m.PolicyCategoriesListModule,
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./new-policy-category/new-policy-category.module').then(
            m => m.NewPolicyCategoryModule,
          ),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./policy-category-detail/policy-category-detail.module').then(
        m => m.PolicyCategoryDetailModule,
      ),
  },
  {
    path: ':serial/edit',
    loadChildren: () =>
      import('./edit-policy-category/edit-policy-category.module').then(
        m => m.EditPolicyCategoryModule,
      ),
  },
];

@NgModule({
  declarations: [AdminPolicyCategoriesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class PolicyCategoriesModule {}
