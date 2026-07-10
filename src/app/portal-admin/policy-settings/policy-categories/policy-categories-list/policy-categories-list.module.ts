import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { PolicyCategoriesListComponent } from './policy-categories-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { PolicyCategoriesAdminTableModule } from '../components/policy-categories-admin-table/policy-categories-admin-table.module';
import { TenantScopeModalModule } from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.module';

const routes: Routes = [{ path: '', component: PolicyCategoriesListComponent }];

@NgModule({
  declarations: [PolicyCategoriesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatDialogModule,
    PagesLayoutModule,
    FilteredTableHeaderModule,
    FiltersModule,
    PolicyCategoriesAdminTableModule,
    TenantScopeModalModule,
  ],
})
export class PolicyCategoriesListModule {}
