import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminBusinessLinesComponent } from './business-lines.component';

const routes: Routes = [
  {
    path: '',
    component: AdminBusinessLinesComponent,
    children: [
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        loadChildren: () =>
          import('./business-lines-list/business-lines-list.module').then(
            m => m.BusinessLinesListModule,
          ),
      },
      {
        path: 'new',
        loadChildren: () =>
          import('./new-business-line/new-business-line.module').then(
            m => m.NewBusinessLineModule,
          ),
      },
    ],
  },
  {
    path: ':serial',
    loadChildren: () =>
      import('./business-line-detail/business-line-detail.module').then(
        m => m.BusinessLineDetailModule,
      ),
  },
  {
    path: ':serial/edit',
    loadChildren: () =>
      import('./edit-business-line/edit-business-line.module').then(
        m => m.EditBusinessLineModule,
      ),
  },
];

@NgModule({
  declarations: [AdminBusinessLinesComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class BusinessLinesModule {}
