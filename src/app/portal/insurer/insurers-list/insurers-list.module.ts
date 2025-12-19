import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InsurersListComponent } from './insurers-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InsurerTableModule } from '../components/insurer-table/insurer-table.module';

const routes: Routes = [
  {
    path: '',
    component: InsurersListComponent,
  },
];

@NgModule({
  declarations: [InsurersListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FilteredTableHeaderModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
    InsurerTableModule,
  ],
  exports: [InsurersListComponent],
})
export class InsurersListModule {}
