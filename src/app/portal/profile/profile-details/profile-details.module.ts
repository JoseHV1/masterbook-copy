import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { ProfileFormModule } from '../components/profile-form/profile-form.module';
import { ProfileDetailsComponent } from './profile-details.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileDetailsComponent,
  },
];

@NgModule({
  declarations: [ProfileDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    ProfileFormModule,
  ],
  exports: [ProfileDetailsComponent],
})
export class ProfileDetailsModule {}
