import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from './users-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { UsersTableModule } from '../components/users-table/users-table.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { PayableAccountManagementModule } from '../components/payable-account-management/payable-user-management.module';

const routes: Routes = [
  {
    path: '',
    component: UsersListComponent,
  },
];

@NgModule({
  declarations: [UsersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FilteredTableHeaderModule,
    UsersTableModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
    PayableAccountManagementModule,
  ],
  exports: [UsersListComponent],
})
export class UsersListModule {}
