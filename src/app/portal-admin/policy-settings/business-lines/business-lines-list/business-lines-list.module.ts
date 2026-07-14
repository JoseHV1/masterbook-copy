import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { BusinessLinesListComponent } from './business-lines-list.component';
import { PagesLayoutModule } from 'src/app/shared/layouts/pages-layout/pages-layout.module';
import { FilteredTableHeaderModule } from 'src/app/shared/components/filters/filtered-table-header/filtered-table-header.module';
import { FiltersModule } from 'src/app/shared/components/filters/filters.module';
import { BusinessLinesAdminTableModule } from '../components/business-lines-admin-table/business-lines-admin-table.module';
import { TenantScopeModalModule } from 'src/app/shared/components/modals/tenant-scope-modal/tenant-scope-modal.module';

const routes: Routes = [{ path: '', component: BusinessLinesListComponent }];

@NgModule({
  declarations: [BusinessLinesListComponent],
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
    BusinessLinesAdminTableModule,
    TenantScopeModalModule,
  ],
})
export class BusinessLinesListModule {}
