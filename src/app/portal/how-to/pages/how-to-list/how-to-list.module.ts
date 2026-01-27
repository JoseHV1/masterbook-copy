import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowToListComponent } from './how-to-list.component';
import { RouterModule, Routes } from '@angular/router';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { HowToTableModule } from '../../components/how-to-table/how-to-table.module';

const routes: Routes = [
  {
    path: '',
    component: HowToListComponent,
  },
];

@NgModule({
  declarations: [HowToListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FiltersModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    FilteredTableHeaderModule,
    HowToTableModule,
  ],
  exports: [HowToListComponent],
})
export class HowToListModule {}
