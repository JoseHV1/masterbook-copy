import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./forms-list/forms-list.module').then(m => m.AdminFormsListModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./form-detail/form-detail.module').then(m => m.AdminFormDetailModule),
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminFormsModule {}
