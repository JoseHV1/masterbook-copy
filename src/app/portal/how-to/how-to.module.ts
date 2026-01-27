import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToComponent } from './how-to.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/how-to-list/how-to-list.module').then(
        module => module.HowToListModule
      ),
  },
  {
    path: 'help',
    loadChildren: () =>
      import('./pages/how-to-grid/how-to-grid.module').then(
        module => module.HowToGridModule
      ),
  },
  {
    path: 'new',
    loadChildren: () =>
      import('./pages/new-how-to/new-how-to.module').then(
        module => module.NewHowToModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./pages/how-to-details/how-to-details.module').then(
        module => module.HowToDetailModule
      ),
  },
  {
    path: ':id/edit',
    loadChildren: () =>
      import('./pages/edit-how-to/edit-how-to.module').then(
        module => module.EditHowToModule
      ),
  },
];

@NgModule({
  declarations: [HowToComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
})
export class HowToModule {}
