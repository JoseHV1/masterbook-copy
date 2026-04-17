import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: AdminProfileComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./profile-details/profile-details.module').then(
            m => m.AdminProfileDetailsModule
          ),
      },
    ],
  },
];

@NgModule({
  declarations: [AdminProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class AdminProfileModule {}
