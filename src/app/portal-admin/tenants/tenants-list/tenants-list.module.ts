import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TenantsListComponent } from './tenants-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { TenantsTableModule } from '../components/tenants-table/tenants-table.module';

const routes: Routes = [{ path: '', component: TenantsListComponent }];

@NgModule({
  declarations: [TenantsListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    FiltersModule,
    TenantsTableModule,
    MatPaginatorModule,
    MatSidenavModule,
  ],
})
export class TenantsListModule {}
