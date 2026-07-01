import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadsListComponent } from './leads-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { LeadsTableModule } from '../components/leads-table/leads-table.module';

const routes: Routes = [
  {
    path: '',
    component: LeadsListComponent,
  },
];

@NgModule({
  declarations: [LeadsListComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    MatSidenavModule,
    MatPaginatorModule,
    FiltersModule,
    FilteredTableHeaderModule,
    LeadsTableModule,
  ],
})
export class LeadsListModule {}
