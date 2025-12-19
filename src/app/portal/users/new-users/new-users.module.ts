import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewUsersComponent } from './new-users.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { RouterModule, Routes } from '@angular/router';
import { FormUsersModule } from '../components/form-users/form-users.module';
import { MatTooltipModule } from '@angular/material/tooltip';

const routes: Routes = [
  {
    path: '',
    component: NewUsersComponent,
  },
];

@NgModule({
  declarations: [NewUsersComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FormUsersModule,
    MatTooltipModule,
  ],
  exports: [NewUsersComponent],
})
export class NewUsersModule {}
