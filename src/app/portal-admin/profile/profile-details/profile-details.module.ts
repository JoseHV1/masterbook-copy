import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AdminProfileDetailsComponent } from './profile-details.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { AdminProfileFormModule } from '../components/admin-profile-form/admin-profile-form.module';

const routes: Routes = [{ path: '', component: AdminProfileDetailsComponent }];

@NgModule({
  declarations: [AdminProfileDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    AdminProfileFormModule,
  ],
})
export class AdminProfileDetailsModule {}
