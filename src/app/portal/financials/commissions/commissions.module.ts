import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommissionsComponent } from './commissions.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./commissions-list/commissions-list.module').then(
        module => module.CommissionsListModule
      ),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./commission-detail/commission-detail.module').then(
        module => module.CommissionDetailsModule
      ),
  },
];
@NgModule({
  declarations: [CommissionsComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [CommissionsComponent],
})
export class CommissionsModule {}
