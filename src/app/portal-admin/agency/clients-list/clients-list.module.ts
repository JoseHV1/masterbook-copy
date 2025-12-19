import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsListComponent } from './clients-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ClientListTableModule } from '../components/client-list-table/client-list-table.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';

const routes: Routes = [
  {
    path: '',
    component: ClientsListComponent,
  },
];

@NgModule({
  declarations: [ClientsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FilteredTableHeaderModule,
    ClientListTableModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
  ],
  exports: [ClientsListComponent],
})
export class ClientsListModule {}
