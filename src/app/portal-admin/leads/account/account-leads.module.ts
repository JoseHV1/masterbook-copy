import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AccountLeadsComponent } from './account-leads.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { AdminLeadsTableModule } from '../components/admin-leads-table/admin-leads-table.module';

const routes: Routes = [{ path: '', component: AccountLeadsComponent }];

@NgModule({
  declarations: [AccountLeadsComponent],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule.forChild(routes),
    PagesLayoutModule,
    FilteredTableHeaderModule,
    AdminLeadsTableModule,
    MatPaginatorModule,
    FiltersModule,
    MatSidenavModule,
  ],
})
export class AccountLeadsModule {}
