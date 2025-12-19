import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsurerComponent } from './insurer.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./insurers-list/insurers-list.module').then(
        module => module.InsurersListModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./insurers-details/insurers-details.module').then(
        module => module.InsurersDetailsModule
      ),
  },
];

@NgModule({
  declarations: [InsurerComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PagesLayoutModule],
  exports: [InsurerComponent],
})
export class InsurerModule {}
