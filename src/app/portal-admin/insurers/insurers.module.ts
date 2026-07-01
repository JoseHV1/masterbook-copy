import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminInsurersComponent } from './insurers.component';

const routes: Routes = [
  {
    path: '',
    component: AdminInsurersComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./insurers-list/insurers-list.module').then(m => m.InsurersListModule),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./new-insurer/new-insurer.module').then(m => m.NewInsurerModule),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./insurer-detail/insurer-detail.module').then(m => m.InsurerDetailModule),
  },
  {
    path: ':serial/edit',
    loadChildren: () =>
      import('./edit-insurer/edit-insurer.module').then(m => m.EditInsurerModule),
  },
];

@NgModule({
  declarations: [AdminInsurersComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminInsurersModule {}
